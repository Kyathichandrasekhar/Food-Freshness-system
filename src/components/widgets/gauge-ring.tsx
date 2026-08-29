import { cn } from "@/lib/utils";

interface RingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  gradientId?: string;
  from?: string; // CSS color
  to?: string;
  className?: string;
}

export function GaugeRing({
  value,
  size = 160,
  stroke = 14,
  label,
  sublabel,
  gradientId = "g-ring",
  from = "oklch(0.78 0.22 150)",
  to = "oklch(0.7 0.15 215)",
  className,
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight">{value}<span className="text-base text-muted-foreground">%</span></div>
          {label && <div className="text-xs font-medium text-foreground/80 mt-0.5">{label}</div>}
          {sublabel && <div className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}
