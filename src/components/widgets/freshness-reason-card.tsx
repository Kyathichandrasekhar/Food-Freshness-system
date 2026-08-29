import { Lightbulb } from "lucide-react";
import type { Food } from "@/lib/freshguard-data";
import { generateFreshnessReason, calculateReasonConfidence } from "@/lib/freshguard-data";

interface FreshnessReasonCardProps {
  food: Food;
}

export function FreshnessReasonCard({ food }: FreshnessReasonCardProps) {
  const reason = generateFreshnessReason(food);
  const confidence = calculateReasonConfidence(food);

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 size-32 rounded-full gradient-safe opacity-20 blur-2xl" />
      
      <div className="flex items-start gap-3 mb-4">
        <div className="size-10 rounded-xl gradient-safe grid place-items-center flex-shrink-0">
          <Lightbulb className="size-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold">📋 Reason</h3>
          <p className="text-xs text-muted-foreground">AI-predicted freshness cause</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Predicted Cause */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Predicted Cause
          </label>
          <p className="text-sm leading-relaxed text-foreground">
            {reason}
          </p>
        </div>

        {/* AI Confidence */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            AI Confidence
          </span>
          <span className="text-sm font-semibold tabular-nums">{confidence}%</span>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold">Prediction Only:</span> This explanation is AI-generated based on sensor patterns and historical data. Actual spoilage conditions may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
