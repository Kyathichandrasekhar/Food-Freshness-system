import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { GaugeRing } from "@/components/widgets/gauge-ring";
import { insights } from "@/lib/freshguard-data";
import { Sparkles, Brain, Target, TrendingUp, Activity } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — FreshGuard AI" }] }),
  component: AIInsightsPage,
});

function AIInsightsPage() {
  const causes = [
    { name: "Temperature drift", count: 42 },
    { name: "Excess humidity", count: 34 },
    { name: "Gas spike (MQ135)", count: 28 },
    { name: "pH change", count: 18 },
    { name: "Storage time", count: 11 },
  ];

  const accuracy = [{ name: "Model", value: 94.8, fill: "oklch(0.72 0.22 148)" }];

  return (
    <div className="space-y-6">
      <PageHeader title="AI Insights" subtitle="Model performance, predictions, and intelligence across your inventory" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 relative overflow-hidden gradient-mesh">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-2xl gradient-safe grid place-items-center"><Brain className="size-5 text-white" /></div>
            <div>
              <div className="text-xs uppercase text-muted-foreground tracking-wider">Model Accuracy</div>
              <div className="text-sm font-semibold">FreshGuard v2.4 — Production</div>
            </div>
          </div>
          <div className="mt-2 flex justify-center">
            <div className="relative size-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="75%" outerRadius="100%" data={accuracy} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: "color-mix(in oklab, var(--muted-foreground) 15%, transparent)" }} dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-4xl font-semibold tabular-nums text-gradient-brand">94.8%</div>
                  <div className="text-xs text-muted-foreground mt-1">Rolling 7-day</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <Mini label="Precision" value="96.1%" />
            <Mini label="Recall" value="93.4%" />
            <Mini label="F1" value="94.7%" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 rounded-xl gradient-ocean grid place-items-center"><Target className="size-4 text-white" /></div>
            <div>
              <h3 className="text-base font-semibold">Most Common Spoilage Causes</h3>
              <p className="text-xs text-muted-foreground">Last 30 days · 133 incidents</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={causes} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" fill="oklch(0.7 0.15 215)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Predictions made" value="12,481" hint="this month" />
        <StatCard icon={Sparkles} label="Confident calls" value="11,890" hint=">90% confidence" />
        <StatCard icon={Activity} label="Avg latency" value="184 ms" hint="edge inference" />
        <StatCard icon={Target} label="False positives" value="1.4%" hint="↓ 0.6% vs v2.3" />
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3 inline-flex items-center gap-2"><Sparkles className="size-4 text-primary" />AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((it, i) => (
            <div key={i} className="glass rounded-2xl p-6 relative overflow-hidden group hover:shadow-[var(--shadow-soft)]">
              <div className="absolute -top-10 -right-10 size-32 rounded-full gradient-safe opacity-15 blur-2xl" />
              <div className="size-10 rounded-xl gradient-safe grid place-items-center mb-3"><Sparkles className="size-5 text-white" /></div>
              <div className="text-base font-semibold leading-tight">{it.title}</div>
              <div className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/60 p-2">
      <div className="text-base font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="size-10 rounded-xl gradient-ocean grid place-items-center"><Icon className="size-5 text-white" /></div>
      <div className="mt-3 text-xs uppercase text-muted-foreground tracking-wider">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
