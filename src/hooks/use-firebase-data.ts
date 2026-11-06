import { useState, useEffect } from "react";
import {
  ref,
  onValue,
  type DataSnapshot,
  query,
  limitToLast,
} from "firebase/database";
import { database } from "@/firebase";
import {
  foods as mockFoods,
  kpis as mockKpis,
  sensorActivity as mockSensorActivity,
  type Food,
  type FoodStatus,
} from "@/lib/freshguard-data";

export interface RealtimeSensorReading {
  id?: number | string;
  food_id?: number | string;
  gas: number;
  ph: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export function useFirebaseConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !database) {
      return;
    }
    setIsSupported(true);

    const connectedRef = ref(database, ".info/connected");
    const unsubscribe = onValue(connectedRef, (snap: DataSnapshot) => {
      setIsConnected(Boolean(snap.val()));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, isSupported };
}

/**
 * Real-time hook for the latest incoming sensor reading from ESP32/FastAPI
 */
export function useRealtimeLatestSensor() {
  const [reading, setReading] = useState<RealtimeSensorReading>({
    gas: 142,
    ph: 6.7,
    temperature: 4.2,
    humidity: 58,
    timestamp: new Date().toISOString(),
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !database) return;

    const latestRef = ref(database, "latest_sensor_reading");
    const unsubscribe = onValue(
      latestRef,
      (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val() as RealtimeSensorReading;
          setReading(val);
          setIsLive(true);
        }
      },
      (error) => {
        console.warn("Firebase latest_sensor_reading listener error:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { reading, isLive };
}

/**
 * Real-time hook for foods list from Firebase Realtime Database
 * Falls back to curated mock foods if no records exist in Firebase yet.
 */
export function useRealtimeFoods(): {
  foods: Food[];
  isLive: boolean;
  loading: boolean;
} {
  const [foodList, setFoodList] = useState<Food[]>(mockFoods);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !database) {
      setLoading(false);
      return;
    }

    const foodsRef = ref(database, "foods");
    const unsubscribe = onValue(
      foodsRef,
      (snapshot: DataSnapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === "object") {
            const parsedFoods: Food[] = Object.entries(val).map(
              ([key, item]: [string, any]) => {
                const gas = Number(item.gas ?? item.latest_reading?.gas ?? 180);
                const ph = Number(item.ph ?? item.latest_reading?.ph ?? 6.0);
                const temp = Number(item.temperature ?? item.latest_reading?.temperature ?? 5.0);
                const hum = Number(item.humidity ?? item.latest_reading?.humidity ?? 60.0);

                let status: FoodStatus = "SAFE";
                let freshness = Number(item.freshness ?? 85);
                if (item.status) {
                  status = item.status;
                } else if (gas > 500 || temp > 20) {
                  status = "UNSAFE";
                  freshness = Math.min(freshness, 35);
                } else if (gas > 250 || temp > 10) {
                  status = "CAUTION";
                  freshness = Math.min(freshness, 68);
                }

                return {
                  id: String(item.id ?? key),
                  name: item.name || "Unknown Food",
                  category: item.category || "General",
                  image:
                    item.image ||
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
                  freshness,
                  status,
                  gas,
                  ph,
                  temperature: temp,
                  humidity: hum,
                  confidence: Number(item.confidence ?? 94),
                  updatedAt: item.updatedAt || "Real-time",
                  device: item.device || "Node-Firebase",
                };
              }
            );

            if (parsedFoods.length > 0) {
              setFoodList(parsedFoods);
              setIsLive(true);
              return;
            }
          }
        }
        // Fallback to default foods if Firebase is empty
        setFoodList(mockFoods);
      },
      (error) => {
        console.warn("Firebase foods listener error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { foods: foodList, isLive, loading };
}

/**
 * Dynamic KPI computation derived from current foods state
 */
export function useRealtimeKpis(foods: Food[]) {
  const totalMonitored = foods.length || mockKpis.totalMonitored;
  const safe = foods.filter((f) => f.status === "SAFE").length;
  const caution = foods.filter((f) => f.status === "CAUTION").length;
  const unsafe = foods.filter((f) => f.status === "UNSAFE").length;
  const freshnessAvg = totalMonitored > 0
    ? Math.round(foods.reduce((acc, f) => acc + f.freshness, 0) / totalMonitored)
    : mockKpis.freshnessAvg;

  // Composite safety score (0-100)
  const safetyScore = totalMonitored > 0
    ? Math.max(10, Math.min(100, Math.round((safe * 100 + caution * 60 + unsafe * 10) / totalMonitored)))
    : mockKpis.safetyScore;

  return {
    safetyScore,
    freshnessAvg,
    totalMonitored,
    safe,
    caution,
    unsafe,
  };
}

/**
 * Real-time sensor history from Firebase RTDB `sensor_readings`
 */
export function useRealtimeSensorHistory(limit: number = 24) {
  const [history, setHistory] = useState(mockSensorActivity);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !database) return;

    const readingsQuery = query(ref(database, "sensor_readings"), limitToLast(limit));
    const unsubscribe = onValue(
      readingsQuery,
      (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === "object") {
            const rawList: RealtimeSensorReading[] = Object.values(val);
            if (rawList.length > 0) {
              const formatted = rawList.map((r, i) => {
                let hourStr = `${i}:00`;
                if (r.timestamp) {
                  try {
                    const d = new Date(r.timestamp);
                    hourStr = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
                  } catch {
                    // keep hourStr
                  }
                }
                return {
                  hour: hourStr,
                  gas: Math.round(Number(r.gas) || 0),
                  temp: Math.round(Number(r.temperature) || 0),
                  humidity: Math.round(Number(r.humidity) || 0),
                };
              });
              setHistory(formatted);
              setIsLive(true);
            }
          }
        }
      },
      (error) => {
        console.warn("Firebase sensor_readings query error:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [limit]);

  return { history, isLive };
}
