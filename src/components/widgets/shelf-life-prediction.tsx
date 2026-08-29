import { Clock, Sparkles, TrendingDown, AlertCircle, Zap } from "lucide-react";
import { ShelfLifePrediction } from "@/lib/freshguard-data";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ShelfLifePredictionSectionProps {
  prediction: ShelfLifePrediction;
}

interface TimelineCheckpoint {
  timestamp: string;
  freshness: number;
  status: "SAFE" | "CAUTION" | "UNSAFE";
  color: string;
  bgColor: string;
  minutes: number;
}

function generateTimelineCheckpoints(prediction: ShelfLifePrediction): TimelineCheckpoint[] {
  const now = new Date();
  const checkpoints: TimelineCheckpoint[] = [];
  
  // Current state
  const currentStatus = prediction.currentFreshness > 70 ? "SAFE" : prediction.currentFreshness > 40 ? "CAUTION" : "UNSAFE";
  checkpoints.push({
    timestamp: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    freshness: prediction.currentFreshness,
    status: currentStatus,
    color: currentStatus === "SAFE" ? "#00C853" : currentStatus === "CAUTION" ? "#FFD600" : "#FF1744",
    bgColor: currentStatus === "SAFE" ? "bg-green-500/20" : currentStatus === "CAUTION" ? "bg-yellow-500/20" : "bg-red-500/20",
    minutes: 0,
  });
  
  // Predict every 1 hour until unsafe
  const hours = Math.ceil(prediction.remainingSafeTimeMinutes / 60);
  let currentFreshness = prediction.currentFreshness;
  const decayRate = Math.max(2, (prediction.currentFreshness / hours));
  
  for (let h = 1; h <= Math.min(hours, 5); h++) {
    const minutesFromNow = h * 60;
    const predictedFreshness = Math.max(10, currentFreshness - (decayRate * h));
    
    let status: "SAFE" | "CAUTION" | "UNSAFE" = "UNSAFE";
    if (predictedFreshness > 70) status = "SAFE";
    else if (predictedFreshness > 40) status = "CAUTION";
    else status = "UNSAFE";
    
    const time = new Date(now.getTime() + minutesFromNow * 60000);
    const statusColor = status === "SAFE" ? "#00C853" : status === "CAUTION" ? "#FFD600" : "#FF1744";
    const bgColor = status === "SAFE" ? "bg-green-500/20" : status === "CAUTION" ? "bg-yellow-500/20" : "bg-red-500/20";
    
    checkpoints.push({
      timestamp: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
      freshness: Math.round(predictedFreshness),
      status,
      color: statusColor,
      bgColor,
      minutes: minutesFromNow,
    });
    
    if (status === "UNSAFE") break;
  }
  
  return checkpoints;
}

const statusColors = {
  SAFE: { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/30", badge: "bg-green-500", light: "#00C853" },
  CAUTION: { bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-500/30", badge: "bg-yellow-500", light: "#FFD600" },
  UNSAFE: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/30", badge: "bg-red-500", light: "#FF1744" },
};

const statusEmoji = { SAFE: "🟢", CAUTION: "🟡", UNSAFE: "🔴" };
const statusLabel = { SAFE: "Safe", CAUTION: "Caution", UNSAFE: "Unsafe" };

export function ShelfLifePredictionSection({ prediction }: ShelfLifePredictionSectionProps) {
  const [checkpoints, setCheckpoints] = useState<TimelineCheckpoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const newCheckpoints = generateTimelineCheckpoints(prediction);
    setCheckpoints(newCheckpoints);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCheckpoints(generateTimelineCheckpoints(prediction));
    }, 10000);
    
    return () => clearInterval(interval);
  }, [prediction]);

  const statusColor = prediction.trendDirection === "critical"
    ? "border-danger/40 bg-danger/5"
    : prediction.trendDirection === "declining"
    ? "border-caution/40 bg-caution/5"
    : "border-safe/30 bg-safe/5";

  const iconColor = prediction.trendDirection === "critical"
    ? "gradient-danger"
    : prediction.trendDirection === "declining"
    ? "gradient-warn"
    : "gradient-safe";

  return (
    <div className={cn("glass rounded-2xl border-2 relative overflow-hidden", statusColor)}>
      <div className={cn("absolute -top-12 -right-12 size-40 rounded-full opacity-15 blur-2xl", iconColor)} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn("size-10 rounded-xl grid place-items-center text-white", iconColor)}>
              <Clock className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Real-Time Spoilage Timeline</h3>
              <p className="text-xs text-muted-foreground">AI shelf life prediction with live updates</p>
            </div>
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600">Live Prediction</span>
            </div>
          )}
        </div>

        {/* Horizontal Timeline */}
        <div className="mb-8">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-min">
              {checkpoints.map((cp, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 animate-fadeIn">
                  {/* Timeline node */}
                  <div className="relative">
                    <div
                      className={cn("size-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-500", cp.bgColor)}
                      style={{ borderColor: cp.color }}
                    >
                      {statusEmoji[cp.status]}
                    </div>
                    {idx < checkpoints.length - 1 && (
                      <div
                        className="absolute top-1/2 -right-[1.125rem] w-4 h-0.5 transform -translate-y-1/2"
                        style={{ background: `linear-gradient(to right, ${cp.color}, ${checkpoints[idx + 1].color})` }}
                      />
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div className="text-center">
                    <div className="text-xs font-semibold text-foreground">{cp.timestamp}</div>
                    <div className="text-xs text-muted-foreground">{statusLabel[cp.status]}</div>
                  </div>
                  
                  {/* Freshness */}
                  <div className="text-center">
                    <div className="text-sm font-bold">{cp.freshness}%</div>
                    <div className="text-xs text-muted-foreground">Freshness</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Status Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricBox label="Current Freshness" value={`${prediction.currentFreshness}%`} icon="🥗" />
          <MetricBox label="Remaining Safe Time" value={prediction.remainingSafeTimeFormatted} icon="⏱️" />
          <MetricBox label="Fresh Until" value={prediction.expectedFreshUntil} icon="🕐" />
          <MetricBox label="AI Confidence" value={`${prediction.aiConfidence}%`} icon="🤖" />
        </div>

        {/* Real-Time Shelf Life Updates Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Zap className="size-4" />
            Real-Time Shelf Life Updates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {checkpoints.slice(0, 3).map((cp, idx) => (
              <div key={idx} className={cn("rounded-xl p-4 border-2 transition-all duration-500", statusColors[cp.status].bg, statusColors[cp.status].border)}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{statusEmoji[cp.status]}</span>
                  <span className={cn("text-xs font-bold uppercase", statusColors[cp.status].text)}>{statusLabel[cp.status]}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {cp.status === "SAFE" && "Food is fresh and safe to consume"}
                  {cp.status === "CAUTION" && "Food quality beginning to decline"}
                  {cp.status === "UNSAFE" && "Food no longer safe to consume"}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Freshness {cp.freshness}%</span>
                  <span className="text-muted-foreground">{cp.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-background/40 mb-4">
          {prediction.trendDirection === "critical" && (
            <>
              <AlertCircle className="size-4 text-danger mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-danger">Critical</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Expected to become unsafe in approximately {Math.round(prediction.remainingSafeTimeMinutes * 0.9 / 60)}h.
                </div>
              </div>
            </>
          )}
          {prediction.trendDirection === "declining" && (
            <>
              <TrendingDown className="size-4 text-caution mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-caution">Declining</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Will enter CAUTION state in approximately {Math.round(prediction.remainingSafeTimeMinutes * 0.7 / 60)}h.
                </div>
              </div>
            </>
          )}
          {prediction.trendDirection === "stable" && (
            <>
              <Sparkles className="size-4 text-safe mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-safe">Stable</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Food is fresh and safe. Continue monitoring normally.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <div className="text-xs text-foreground/60 leading-relaxed border-t border-border/30 pt-4">
          This prediction updates dynamically using temperature, humidity, gas sensor values, pH readings, food type, and historical freshness trends.
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl p-3 bg-background/40 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-sm font-bold mt-1">{value}</div>
    </div>
  );
}
