import { Clock, Zap } from "lucide-react";
import { shelfLifePredictions } from "@/lib/freshguard-data";

export function ShelfLifeCard() {
  // Get the most critical prediction
  const criticalPred = shelfLifePredictions
    .sort((a, b) => a.remainingSafeTimeMinutes - b.remainingSafeTimeMinutes)
    .find(p => p.trendDirection !== "stable");

  if (!criticalPred) {
    // All food items are stable
    return (
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-32 rounded-full gradient-safe opacity-20 blur-2xl" />
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl gradient-safe grid place-items-center">
              <Clock className="size-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">Shelf Life Prediction</div>
              <div className="text-[11px] text-muted-foreground">All items stable</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-foreground/90">
          All monitored food items are within safe consumption windows. No immediate action required.
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      <div className={`absolute -top-10 -right-10 size-32 rounded-full ${
        criticalPred.trendDirection === "critical" 
          ? "gradient-danger" 
          : "gradient-warn"
      } opacity-20 blur-2xl`} />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`size-9 rounded-xl ${
            criticalPred.trendDirection === "critical" 
              ? "gradient-danger" 
              : "gradient-warn"
          } grid place-items-center`}>
            <Zap className="size-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold">Shelf Life Prediction</div>
            <div className="text-[11px] text-muted-foreground">{criticalPred.foodName}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[11px] uppercase text-muted-foreground font-medium">Remaining Safe</div>
          <div className="text-lg font-bold tabular-nums mt-1">{criticalPred.remainingSafeTimeFormatted}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-muted-foreground font-medium">Fresh Until</div>
          <div className="text-lg font-bold tabular-nums mt-1">{criticalPred.expectedFreshUntil}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-muted-foreground font-medium">Confidence</div>
          <div className="text-lg font-bold tabular-nums mt-1">{criticalPred.aiConfidence}%</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-foreground/80 leading-relaxed">
        Prediction based on freshness trend, sensor readings, and environmental conditions.
      </div>
    </div>
  );
}
