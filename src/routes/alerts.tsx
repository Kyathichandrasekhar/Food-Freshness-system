import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { alerts, shelfLifeAlerts } from "@/lib/freshguard-data";
import { AlertTriangle, AlertOctagon, CheckCircle2, Clock, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — FreshGuard AI" }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const critical = alerts.filter(a => a.priority === "critical");
  const warning = alerts.filter(a => a.priority === "warning");
  const resolved = alerts.filter(a => a.priority === "resolved");

  // Combine with shelf life alerts
  const shelfLifeCritical = shelfLifeAlerts.filter(a => a.priority === "high");
  const shelfLifeWarning = shelfLifeAlerts.filter(a => a.priority === "medium" || a.priority === "low");

  return (
    <div className="space-y-6">
      <PageHeader title="Alerts" subtitle="Real-time notifications across your monitored inventory" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Critical" count={critical.length + shelfLifeCritical.length} icon={AlertOctagon} tone="danger" />
        <SummaryCard label="Warnings" count={warning.length + shelfLifeWarning.length} icon={AlertTriangle} tone="warn" />
        <SummaryCard label="Resolved" count={resolved.length} icon={CheckCircle2} tone="safe" />
      </div>

      <Section title="Critical Alerts" items={critical} />
      {shelfLifeCritical.length > 0 && <ShelfLifeSection title="Critical Shelf Life Alerts" items={shelfLifeCritical} />}
      
      <Section title="Warnings" items={warning} />
      {shelfLifeWarning.length > 0 && <ShelfLifeSection title="Shelf Life Warnings" items={shelfLifeWarning} />}
      
      <Section title="Resolved" items={resolved} />
    </div>
  );
}

function SummaryCard({ label, count, icon: Icon, tone }: { label: string; count: number; icon: any; tone: "danger" | "warn" | "safe" }) {
  const grads = { danger: "gradient-danger", warn: "gradient-warn", safe: "gradient-safe" };
  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      <div className={cn("absolute -top-10 -right-10 size-32 rounded-full opacity-25 blur-2xl", grads[tone])} />
      <div className="flex items-center gap-4">
        <div className={cn("size-12 rounded-2xl grid place-items-center text-white", grads[tone])}>
          <Icon className="size-6" />
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground tracking-wider">{label}</div>
          <div className="text-3xl font-semibold tabular-nums">{count}</div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: typeof alerts }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      <div className="space-y-3">
        {items.map(a => {
          const grads = { critical: "gradient-danger", warning: "gradient-warn", resolved: "gradient-safe" } as const;
          const borders = { critical: "border-danger/30", warning: "border-caution/40", resolved: "border-safe/30" } as const;
          return (
            <div key={a.id} className={cn("glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 border-2 relative overflow-hidden", borders[a.priority])}>
              <div className={cn("absolute -left-12 top-0 bottom-0 w-32 opacity-20 blur-2xl", grads[a.priority])} />
              <div className={cn("size-12 rounded-2xl grid place-items-center text-white shrink-0", grads[a.priority])}>
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{a.food}</span>
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white", grads[a.priority])}>{a.priority}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{a.reason}</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Cpu className="size-3" />{a.sensor} · {a.value}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="size-3" />{a.time}</span>
                </div>
              </div>
              <div className="text-right md:min-w-[160px]">
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Action</div>
                <div className="text-sm font-medium">{a.action}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShelfLifeSection({ title, items }: { title: string; items: typeof shelfLifeAlerts }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      <div className="space-y-3">
        {items.map(a => {
          const gradMap = { high: "gradient-danger", medium: "gradient-warn", low: "gradient-ocean" } as const;
          const borderMap = { high: "border-danger/30", medium: "border-caution/40", low: "border-ocean/30" } as const;
          return (
            <div key={a.id} className={cn("glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 border-2 relative overflow-hidden", borderMap[a.priority])}>
              <div className={cn("absolute -left-12 top-0 bottom-0 w-32 opacity-20 blur-2xl", gradMap[a.priority])} />
              <div className={cn("size-12 rounded-2xl grid place-items-center text-white shrink-0", gradMap[a.priority])}>
                <Clock className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{a.foodName}</span>
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white", gradMap[a.priority])}>{a.priority}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{a.reason}</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  {a.timeUntilCautionMinutes && (
                    <span className="inline-flex items-center gap-1">
                      ⏱️ CAUTION in {Math.round(a.timeUntilCautionMinutes / 60)}h {a.timeUntilCautionMinutes % 60}m
                    </span>
                  )}
                  {a.timeUntilUnsafeMinutes && (
                    <span className="inline-flex items-center gap-1">
                      🔴 UNSAFE in {Math.round(a.timeUntilUnsafeMinutes / 60)}h {a.timeUntilUnsafeMinutes % 60}m
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right md:min-w-[160px]">
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Recommendation</div>
                <div className="text-sm font-medium">{a.recommendation}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
