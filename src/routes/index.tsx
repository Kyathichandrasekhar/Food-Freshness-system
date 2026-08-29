import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/widgets/kpi-card";
import { GaugeRing } from "@/components/widgets/gauge-ring";
import { FoodCard } from "@/components/widgets/food-card";
import { ShelfLifeCard } from "@/components/widgets/shelf-life-card";
import { foods, kpis, sensorActivity, insights, devices } from "@/lib/freshguard-data";
import {
  ShieldCheck, Leaf, Package, CheckCircle2, AlertTriangle, XCircle,
  Sparkles, Cpu, Activity, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FreshGuard AI" },
      { name: "description", content: "Real-time food safety overview, sensor activity, and AI predictions." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const recent = foods.slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Aarav"
        subtitle="Smart Food Safety Monitoring Powered by Artificial Intelligence"
        actions={
          <button className="inline-flex items-center gap-2 px-4 h-10 rounded-xl gradient-safe text-white text-sm font-medium shadow-[var(--shadow-glow)] hover:opacity-95 transition">
            <Sparkles className="size-4" /> Run AI Scan
          </button>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Safety Score" value={`${kpis.safetyScore}`} delta={4.2} icon={ShieldCheck} tone="primary" />
        <KpiCard label="Avg Freshness" value={`${kpis.freshnessAvg}%`} delta={2.1} icon={Leaf} tone="ocean" />
        <KpiCard label="Foods Monitored" value={kpis.totalMonitored} delta={12} icon={Package} tone="ocean" />
        <KpiCard label="Safe" value={kpis.safe} delta={6} icon={CheckCircle2} tone="primary" />
        <KpiCard label="Caution" value={kpis.caution} delta={-3} icon={AlertTriangle} tone="warn" />
        <KpiCard label="Unsafe" value={kpis.unsafe} delta={-8} icon={XCircle} tone="danger" />
      </div>

      {/* Hero row: gauges + AI recommendation */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 xl:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-60 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center gap-6 justify-around">
            <GaugeRing value={kpis.safetyScore} label="Safety Score" sublabel="Aggregate health" gradientId="g1" />
            <GaugeRing value={kpis.freshnessAvg} label="Freshness" sublabel="Avg across nodes" gradientId="g2" from="oklch(0.7 0.15 215)" to="oklch(0.88 0.16 165)" />
            <GaugeRing value={94} label="AI Confidence" sublabel="7-day rolling" gradientId="g3" from="oklch(0.82 0.18 85)" to="oklch(0.78 0.22 150)" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-40 rounded-full gradient-ocean opacity-20 blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 rounded-xl gradient-ocean grid place-items-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">AI Recommendation</div>
              <div className="text-[11px] text-muted-foreground">Updated just now</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            Move the <span className="font-semibold text-foreground">cooked rice</span> from Node-B2 to colder storage within
            <span className="font-semibold text-danger"> 15 minutes</span>. Predicted spoilage probability has risen to <span className="font-semibold">82%</span>.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground">Apply action</button>
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border">Dismiss</button>
          </div>
        </div>
      </div>

      {/* Live sensor chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Live Sensor Activity</h2>
              <p className="text-xs text-muted-foreground">MQ135 gas levels across all connected nodes — last 24h</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-safe">
              <span className="size-1.5 rounded-full bg-safe pulse-dot" /> Streaming
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorActivity}>
                <defs>
                  <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.22 150)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.22 150)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.15 215)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.7 0.15 215)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="gas" stroke="oklch(0.78 0.22 150)" strokeWidth={2} fill="url(#gasGrad)" />
                <Area type="monotone" dataKey="humidity" stroke="oklch(0.7 0.15 215)" strokeWidth={2} fill="url(#humGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices panel */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold inline-flex items-center gap-2"><Cpu className="size-4" />Connected Devices</h2>
            <span className="text-xs text-muted-foreground">{devices.filter(d => d.status === "online").length}/{devices.length} online</span>
          </div>
          <div className="space-y-3">
            {devices.slice(0, 5).map(d => (
              <div key={d.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/40 transition">
                <div className={`size-9 rounded-xl grid place-items-center ${d.status === "online" ? "bg-safe/15 text-safe" : "bg-danger/15 text-danger"}`}>
                  <Activity className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">Uptime {d.uptime} · {d.sensors.join(" · ")}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold tabular-nums">{d.battery}%</div>
                  <div className={`text-[10px] uppercase ${d.status === "online" ? "text-safe" : "text-danger"}`}>{d.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shelf Life Prediction Card */}
      <ShelfLifeCard />

      {/* Recent food status */}
      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recent Food Status</h2>
            <p className="text-xs text-muted-foreground">Latest readings from monitored items</p>
          </div>
          <a href="/food-monitoring" className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="size-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {recent.map(f => <FoodCard key={f.id} food={f} />)}
        </div>
      </div>

      {/* Insights strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((it, i) => (
          <div key={i} className="glass rounded-2xl p-5 relative overflow-hidden group hover:shadow-[var(--shadow-soft)] transition">
            <div className="size-9 rounded-xl gradient-safe grid place-items-center mb-3">
              <Sparkles className="size-4 text-white" />
            </div>
            <div className="text-sm font-semibold leading-tight">{it.title}</div>
            <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
