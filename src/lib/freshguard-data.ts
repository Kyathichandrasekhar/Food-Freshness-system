// Centralized mock data for FreshGuard AI
export type FoodStatus = "SAFE" | "CAUTION" | "UNSAFE";

export interface Food {
  id: string;
  name: string;
  category: string;
  image: string;
  freshness: number; // 0-100
  status: FoodStatus;
  gas: number; // MQ135 ppm
  ph: number;
  temperature: number; // °C
  humidity: number; // %
  confidence: number; // AI 0-100
  updatedAt: string;
  device: string;
}

export interface ShelfLifePrediction {
  foodId: string;
  foodName: string;
  category: string;
  currentFreshness: number;
  remainingSafeTimeMinutes: number;
  remainingSafeTimeFormatted: string;
  expectedFreshUntil: string;
  predictedSpoilageTime: string;
  aiConfidence: number;
  statusAtSpoilage: FoodStatus;
  trendDirection: "stable" | "declining" | "critical";
}

export interface ShelfLifeHistoryEntry {
  id: string;
  foodId: string;
  foodName: string;
  timestamp: string;
  prediction: ShelfLifePrediction;
}

export interface ShelfLifeAlert {
  id: string;
  foodId: string;
  foodName: string;
  reason: string;
  timeUntilCautionMinutes?: number;
  timeUntilUnsafeMinutes?: number;
  recommendation: string;
  priority: "high" | "medium" | "low";
}

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const foods: Food[] = [
  {
    id: "milk-01",
    name: "Whole Milk",
    category: "Dairy",
    image: img("photo-1563636619-e9143da7973b"),
    freshness: 92,
    status: "SAFE",
    gas: 142,
    ph: 6.7,
    temperature: 4.2,
    humidity: 58,
    confidence: 97,
    updatedAt: "2 min ago",
    device: "Node-A1",
  },
  {
    id: "veg-01",
    name: "Leafy Greens",
    category: "Vegetables",
    image: img("photo-1540420773420-3366772f4999"),
    freshness: 74,
    status: "CAUTION",
    gas: 318,
    ph: 5.9,
    temperature: 6.1,
    humidity: 72,
    confidence: 91,
    updatedAt: "4 min ago",
    device: "Node-A2",
  },
  {
    id: "fruit-01",
    name: "Strawberries",
    category: "Fruits",
    image: img("photo-1464965911861-746a04b4bca6"),
    freshness: 88,
    status: "SAFE",
    gas: 198,
    ph: 3.6,
    temperature: 5.0,
    humidity: 65,
    confidence: 95,
    updatedAt: "1 min ago",
    device: "Node-B1",
  },
  {
    id: "stored-01",
    name: "Cooked Rice",
    category: "Stored Food",
    image: img("photo-1536304993881-ff6e9eefa2a6"),
    freshness: 41,
    status: "UNSAFE",
    gas: 612,
    ph: 4.8,
    temperature: 22.3,
    humidity: 78,
    confidence: 98,
    updatedAt: "Just now",
    device: "Node-B2",
  },
  {
    id: "fruit-02",
    name: "Bananas",
    category: "Fruits",
    image: img("photo-1571771894821-ce9b6c11b08e"),
    freshness: 68,
    status: "CAUTION",
    gas: 274,
    ph: 5.2,
    temperature: 18.5,
    humidity: 60,
    confidence: 89,
    updatedAt: "6 min ago",
    device: "Node-B1",
  },
  {
    id: "veg-02",
    name: "Tomatoes",
    category: "Vegetables",
    image: img("photo-1592924357228-91a4daadcfea"),
    freshness: 81,
    status: "SAFE",
    gas: 176,
    ph: 4.4,
    temperature: 9.0,
    humidity: 62,
    confidence: 93,
    updatedAt: "3 min ago",
    device: "Node-A2",
  },
  {
    id: "meat-01",
    name: "Chicken Breast",
    category: "Meat",
    image: img("photo-1604503468506-a8da13d82791"),
    freshness: 33,
    status: "UNSAFE",
    gas: 720,
    ph: 6.9,
    temperature: 11.4,
    humidity: 80,
    confidence: 99,
    updatedAt: "Just now",
    device: "Node-C1",
  },
  {
    id: "bread-01",
    name: "Whole Wheat Bread",
    category: "Bakery",
    image: img("photo-1509440159596-0249088772ff"),
    freshness: 79,
    status: "SAFE",
    gas: 188,
    ph: 5.5,
    temperature: 21.0,
    humidity: 48,
    confidence: 90,
    updatedAt: "5 min ago",
    device: "Node-C2",
  },
];

export const kpis = {
  safetyScore: 87,
  freshnessAvg: 78,
  totalMonitored: foods.length,
  safe: foods.filter((f) => f.status === "SAFE").length,
  caution: foods.filter((f) => f.status === "CAUTION").length,
  unsafe: foods.filter((f) => f.status === "UNSAFE").length,
};

export const weeklyTrend = [
  { day: "Mon", fresh: 82, spoilage: 18, predicted: 80 },
  { day: "Tue", fresh: 85, spoilage: 15, predicted: 83 },
  { day: "Wed", fresh: 78, spoilage: 22, predicted: 79 },
  { day: "Thu", fresh: 88, spoilage: 12, predicted: 86 },
  { day: "Fri", fresh: 84, spoilage: 16, predicted: 85 },
  { day: "Sat", fresh: 76, spoilage: 24, predicted: 77 },
  { day: "Sun", fresh: 87, spoilage: 13, predicted: 88 },
];

export const monthlyTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  freshness: 70 + Math.round(Math.sin(i / 3) * 12 + Math.random() * 8),
  spoilage: 30 + Math.round(Math.cos(i / 4) * 8 + Math.random() * 6),
}));

export const sensorActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  gas: 150 + Math.round(Math.sin(i / 3) * 80 + Math.random() * 60),
  temp: 5 + Math.round(Math.sin(i / 4) * 3 + Math.random() * 2),
  humidity: 55 + Math.round(Math.cos(i / 5) * 10 + Math.random() * 5),
}));

export const categoryDistribution = [
  { name: "Dairy", value: 24, color: "var(--ocean)" },
  { name: "Vegetables", value: 32, color: "var(--primary)" },
  { name: "Fruits", value: 28, color: "var(--mint)" },
  { name: "Meat", value: 9, color: "var(--danger)" },
  { name: "Bakery", value: 7, color: "var(--caution)" },
];

export const alerts = [
  {
    id: "a1",
    food: "Cooked Rice",
    reason: "Gas reading exceeds spoilage threshold",
    sensor: "MQ135",
    value: "612 ppm",
    time: "2 min ago",
    priority: "critical" as const,
    action: "Discard immediately",
  },
  {
    id: "a2",
    food: "Chicken Breast",
    reason: "Temperature above safe range",
    sensor: "DHT11",
    value: "11.4°C",
    time: "5 min ago",
    priority: "critical" as const,
    action: "Discard immediately",
  },
  {
    id: "a3",
    food: "Leafy Greens",
    reason: "pH drift detected",
    sensor: "pH Probe",
    value: "5.9",
    time: "14 min ago",
    priority: "warning" as const,
    action: "Consume within 24h",
  },
  {
    id: "a4",
    food: "Bananas",
    reason: "Humidity spike near container",
    sensor: "DHT11",
    value: "60%",
    time: "1 h ago",
    priority: "warning" as const,
    action: "Move to cooler storage",
  },
  {
    id: "a5",
    food: "Tomatoes",
    reason: "Auto-recovered to safe range",
    sensor: "MQ135",
    value: "176 ppm",
    time: "3 h ago",
    priority: "resolved" as const,
    action: "No action needed",
  },
];

export const devices = [
  { id: "Node-A1", name: "NodeMCU A1 — Cold Storage", status: "online", uptime: "12d 4h", battery: 92, sensors: ["MQ135", "DHT11", "pH"] },
  { id: "Node-A2", name: "NodeMCU A2 — Produce Bay", status: "online", uptime: "8d 11h", battery: 78, sensors: ["MQ135", "DHT11"] },
  { id: "Node-B1", name: "NodeMCU B1 — Fruit Crate", status: "online", uptime: "21d 2h", battery: 64, sensors: ["MQ135", "DHT11", "pH"] },
  { id: "Node-B2", name: "NodeMCU B2 — Pantry", status: "online", uptime: "6d 3h", battery: 88, sensors: ["MQ135", "DHT11"] },
  { id: "Node-C1", name: "NodeMCU C1 — Meat Locker", status: "offline", uptime: "—", battery: 0, sensors: ["MQ135", "DHT11", "pH"] },
  { id: "Node-C2", name: "NodeMCU C2 — Bakery Shelf", status: "online", uptime: "2d 9h", battery: 96, sensors: ["MQ135", "DHT11"] },
];

export const insights = [
  { title: "Spoilage risk down 18% this week", body: "Cold-chain stability improved across dairy and produce nodes after the threshold tuning on Tuesday." },
  { title: "Meat locker requires attention", body: "Node-C1 has been offline for 11 minutes. Predicted 9.2% spoilage risk if downtime exceeds 30 min." },
  { title: "Optimal humidity for fruits: 60–65%", body: "Cluster analysis across 1,284 readings shows freshness peaks within this band." },
  { title: "Model confidence trending up", body: "Rolling 7-day AI confidence improved from 91.4% to 94.8% after latest retraining." },
];

export const history = Array.from({ length: 24 }, (_, i) => {
  const f = foods[i % foods.length];
  return {
    id: `h-${i}`,
    food: f.name,
    freshness: Math.max(20, f.freshness - i),
    gas: f.gas + i * 3,
    ph: f.ph,
    prediction: f.status,
    time: `${i + 1}h ago`,
  };
});

export function statusTone(s: FoodStatus) {
  if (s === "SAFE") return { bg: "bg-safe/10", text: "text-safe", border: "border-safe/30", grad: "gradient-safe" };
  if (s === "CAUTION") return { bg: "bg-caution/10", text: "text-caution", border: "border-caution/40", grad: "gradient-warn" };
  return { bg: "bg-danger/10", text: "text-danger", border: "border-danger/40", grad: "gradient-danger" };
}

// Shelf Life Prediction Utility Functions
function calculateShelfLifePrediction(food: Food): ShelfLifePrediction {
  // Base shelf life by category (in hours)
  const shelfLifeBase: Record<string, number> = {
    "Dairy": 48,
    "Meat": 36,
    "Vegetables": 72,
    "Fruits": 96,
    "Bakery": 120,
    "Stored Food": 24,
    "Drinks": 240,
    "Other": 60,
  };

  const baseTtl = shelfLifeBase[food.category] || 60;
  
  // Calculate remaining time based on freshness
  const freshnessRatio = food.freshness / 100;
  let remainingMinutes = baseTtl * 60 * freshnessRatio;
  
  // Adjust for temperature (higher temp = faster spoilage)
  const tempFactor = food.temperature > 10 ? (1 - ((food.temperature - 10) / 20)) : 1;
  remainingMinutes *= Math.max(0.3, tempFactor);
  
  // Adjust for humidity (extreme humidity = faster spoilage)
  const humidityFactor = food.humidity > 75 || food.humidity < 40 ? 0.7 : 1;
  remainingMinutes *= humidityFactor;
  
  // Adjust for gas levels (higher gas = faster spoilage)
  const gasThreshold = food.category === "Meat" ? 400 : food.category === "Dairy" ? 250 : 350;
  const gasFactor = food.gas > gasThreshold ? Math.max(0.4, 1 - (food.gas - gasThreshold) / 500) : 1;
  remainingMinutes *= gasFactor;
  
  // Adjust for pH (outside normal range = faster spoilage)
  const phRange = food.category === "Meat" ? { min: 6.5, max: 7.5 } : { min: 3.5, max: 6.5 };
  const phFactor = (food.ph >= phRange.min && food.ph <= phRange.max) ? 1 : 0.75;
  remainingMinutes *= phFactor;
  
  // Final calculation - ensure minimum is 15 minutes
  remainingMinutes = Math.max(15, Math.round(remainingMinutes));
  
  // Determine trend
  const trendDirection: "stable" | "declining" | "critical" = 
    remainingMinutes < 120 ? "critical" : remainingMinutes < 240 ? "declining" : "stable";
  
  // Format remaining time
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  const remainingSafeTimeFormatted = `${hours}h ${minutes}m`;
  
  // Calculate expected fresh until time
  const now = new Date();
  const freshUntil = new Date(now.getTime() + remainingMinutes * 60000);
  const expectedFreshUntil = freshUntil.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  
  // Calculate spoilage time (CAUTION at ~70% through, UNSAFE at ~90% through)
  const cautionMinutes = Math.round(remainingMinutes * 0.7);
  const unsafeMinutes = Math.round(remainingMinutes * 0.9);
  const unsafeTime = new Date(now.getTime() + unsafeMinutes * 60000);
  const predictedSpoilageTime = unsafeTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  
  return {
    foodId: food.id,
    foodName: food.name,
    category: food.category,
    currentFreshness: food.freshness,
    remainingSafeTimeMinutes: remainingMinutes,
    remainingSafeTimeFormatted,
    expectedFreshUntil,
    predictedSpoilageTime,
    aiConfidence: food.confidence,
    statusAtSpoilage: food.status === "UNSAFE" ? "UNSAFE" : "CAUTION",
    trendDirection,
  };
}

// Generate shelf life predictions for all foods
export const shelfLifePredictions = foods.map(calculateShelfLifePrediction);

// Get prediction for specific food
export function getShelfLifePrediction(foodId: string): ShelfLifePrediction | undefined {
  return shelfLifePredictions.find(p => p.foodId === foodId);
}

// Generate shelf life-based alerts
export const shelfLifeAlerts: ShelfLifeAlert[] = shelfLifePredictions
  .filter(pred => pred.trendDirection !== "stable")
  .map(pred => ({
    id: `sl-${pred.foodId}`,
    foodId: pred.foodId,
    foodName: pred.foodName,
    reason: pred.trendDirection === "critical" 
      ? `${pred.foodName} approaching unsafe state`
      : `${pred.foodName} will enter CAUTION state soon`,
    timeUntilCautionMinutes: Math.round(pred.remainingSafeTimeMinutes * 0.7),
    timeUntilUnsafeMinutes: Math.round(pred.remainingSafeTimeMinutes * 0.9),
    recommendation: pred.remainingSafeTimeMinutes < 120
      ? "Take immediate action - discard or consume"
      : "Monitor closely and plan usage",
    priority: pred.trendDirection === "critical" ? "high" : "medium",
  }));

// Shelf life prediction history (simulated)
export const shelfLifeHistory: ShelfLifeHistoryEntry[] = Array.from({ length: 12 }, (_, i) => {
  const food = foods[i % foods.length];
  const pred = shelfLifePredictions.find(p => p.foodId === food.id)!;
  return {
    id: `slh-${i}`,
    foodId: food.id,
    foodName: food.name,
    timestamp: `${i + 1}h ago`,
    prediction: {
      ...pred,
      remainingSafeTimeMinutes: pred.remainingSafeTimeMinutes + (Math.random() * 60 - 30),
    },
  };
});

// Shelf life forecast data for analytics (14-day forecast)
export const shelfLifeForecast = Array.from({ length: 14 }, (_, i) => ({
  day: i + 1,
  safe: Math.max(10, 85 - i * 3 - Math.random() * 5),
  caution: Math.min(50, 10 + i * 2 + Math.random() * 3),
  unsafe: Math.max(5, 5 + i * 1 + Math.random() * 2),
}));

// Food degradation forecast data
export const foodDegradationForecast = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  milk: Math.max(20, 90 - i * 2),
  greens: Math.max(15, 75 - i * 2.5),
  rice: Math.max(10, 45 - i * 1.5),
  chicken: Math.max(15, 35 - i * 1),
}));

// AI-Generated Freshness Decline Reason
export function generateFreshnessReason(food: Food): string {
  const factors: string[] = [];
  let factorCount = 0;

  // Temperature analysis
  if (food.temperature > 15) {
    factors.push("elevated temperature levels predict accelerated bacterial growth");
    factorCount++;
  } else if (food.temperature < 2) {
    factors.push("extremely low temperatures may affect cellular structure");
    factorCount++;
  }

  // Humidity analysis
  if (food.humidity > 75) {
    factors.push("high humidity conditions promote microbial activity and moisture-related spoilage");
    factorCount++;
  } else if (food.humidity < 40) {
    factors.push("low humidity may cause dehydration and quality degradation");
    factorCount++;
  }

  // Gas sensor analysis (MQ135 PPM readings)
  if (food.gas > 450) {
    factors.push("significant gas emissions indicate rapid organic decomposition");
    factorCount++;
  } else if (food.gas > 300) {
    factors.push("increased gas sensor readings suggest possible decomposition processes");
    factorCount++;
  }

  // pH analysis (category-specific)
  let phDeviation = 0;
  const normalPhRange: Record<string, { min: number; max: number }> = {
    "Dairy": { min: 6.5, max: 7.2 },
    "Meat": { min: 6.5, max: 7.5 },
    "Vegetables": { min: 4.5, max: 6.5 },
    "Fruits": { min: 3.0, max: 5.0 },
    "Bakery": { min: 5.0, max: 6.5 },
    "Stored Food": { min: 4.5, max: 7.0 },
  };

  const range = normalPhRange[food.category] || { min: 4.0, max: 7.0 };
  if (food.ph < range.min || food.ph > range.max) {
    phDeviation = Math.abs(food.ph - (range.min + range.max) / 2);
    if (phDeviation > 1.5) {
      factors.push("significant pH deviations indicate ongoing food degradation");
      factorCount++;
    }
  }

  // Freshness level analysis
  if (food.freshness < 50) {
    factors.push("substantially reduced freshness indicates advanced spoilage processes");
    factorCount++;
  }

  // Generate reason string
  if (factorCount === 0) {
    return `Current sensor readings show stable conditions. ${food.name} remains in good condition with no immediate degradation factors detected.`;
  }

  if (factorCount === 1) {
    return `${factors[0].charAt(0).toUpperCase()}${factors[0].slice(1)}, reducing shelf life.`;
  }

  if (factorCount === 2) {
    return `${factors[0].charAt(0).toUpperCase()}${factors[0].slice(1)}, and ${factors[1]} collectively indicate a higher risk of freshness decline.`;
  }

  // Multiple factors (3+)
  const factorList = factors.slice(0, 3).join(", ");
  return `Multiple degradation factors detected: ${factorList}. These conditions collectively predict accelerated spoilage risk.`;
}

// Calculate AI confidence for the freshness decline reason
export function calculateReasonConfidence(food: Food): number {
  let confidence = food.confidence; // Start with base AI confidence
  let confidenceFactors = 0;

  // Factor in sensor data consistency
  if (food.temperature > 15 || food.temperature < 2) {
    confidence = Math.min(100, confidence + 5);
    confidenceFactors++;
  }

  if (food.humidity > 75 || food.humidity < 40) {
    confidence = Math.min(100, confidence + 4);
    confidenceFactors++;
  }

  if (food.gas > 300) {
    confidence = Math.min(100, confidence + 5);
    confidenceFactors++;
  }

  // Reduce confidence if freshness is high (less certain about decline)
  if (food.freshness > 80) {
    confidence = Math.max(75, confidence - 8);
  }

  // Boost confidence if status is critical
  if (food.status === "UNSAFE") {
    confidence = Math.min(100, confidence + 10);
  } else if (food.status === "CAUTION") {
    confidence = Math.min(100, confidence + 5);
  }

  return Math.round(confidence);
}
