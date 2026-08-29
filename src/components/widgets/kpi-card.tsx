import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "ocean" | "warn" | "danger";
  className?: string;
}

const toneMap = {
  primary: { grad: "gradient-safe", text: "text-safe", bg: "bg-safe/10" },
  ocean: { grad: "gradient-ocean", text: "text-ocean", bg: "bg-ocean/10" },
  warn: { grad: "gradient-warn", text: "text-caution", bg: "bg-caution/10" },
  danger: { grad: "gradient-danger", text: "text-danger", bg: "bg-danger/10" },
};

export function KpiCard({ label, value, delta, hint, icon: Icon, tone = "primary", className }: KpiCardProps) {
  const t = toneMap[tone];
  const up = (delta ?? 0) >= 0;

  return (
    <div className={cn("glass rounded-2xl p-5 relative overflow-hidden group hover:shadow-[var(--shadow-soft)] transition-all", className)}>
      <div className={cn("absolute -top-12 -right-12 size-32 rounded-full opacity-20 blur-2xl", t.grad)} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className={cn("size-11 rounded-xl grid place-items-center", t.grad)}>
          <Icon className="size-5 text-white" />
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold", up ? "bg-safe/15 text-safe" : "bg-danger/15 text-danger")}>
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  );
}
