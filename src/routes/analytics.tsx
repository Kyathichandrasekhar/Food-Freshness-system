import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { weeklyTrend, monthlyTrend, sensorActivity, categoryDistribution, foods, shelfLifeForecast, foodDegradationForecast } from "@/lib/freshguard-data";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — FreshGuard AI" }] }),
  component: AnalyticsPage,
});

const tipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 };

function AnalyticsPage() {
  // Heatmap data: 7 days × 8 categories
  const heatRows = ["Dairy", "Veg", "Fruit", "Meat", "Bakery", "Stored", "Drinks", "Other"];
  const heatCols = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heat = heatRows.map((r) => ({ r, vals: heatCols.map(() => Math.round(40 + Math.random() * 60)) }));

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Trends, predictions, and AI confidence across your monitored inventory" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Weekly Freshness Trend" subtitle="Fresh vs spoilage, last 7 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.22 148)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.72 0.22 148)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ws" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.27 25)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.62 0.27 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Area type="monotone" dataKey="fresh" stroke="oklch(0.72 0.22 148)" strokeWidth={2.5} fill="url(#wf)" />
              <Area type="monotone" dataKey="spoilage" stroke="oklch(0.62 0.27 25)" strokeWidth={2} fill="url(#ws)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Categories" subtitle="Distribution of monitored items">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                {categoryDistribution.map((d, i) => (
                  <Cell key={i} fill={["oklch(0.72 0.22 148)","oklch(0.7 0.15 215)","oklch(0.88 0.16 165)","oklch(0.62 0.27 25)","oklch(0.82 0.18 85)"][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Monthly Freshness Trend" subtitle="30-day rolling average" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Line type="monotone" dataKey="freshness" stroke="oklch(0.72 0.22 148)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="spoilage" stroke="oklch(0.7 0.15 215)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="AI Confidence Analysis" subtitle="Prediction accuracy by category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: "Dairy", acc: 96 },
              { name: "Veg", acc: 92 },
              { name: "Fruit", acc: 94 },
              { name: "Meat", acc: 98 },
              { name: "Bakery", acc: 89 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[80, 100]} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="acc" fill="oklch(0.72 0.22 148)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Sensor Activity (24h)" subtitle="Aggregated across all nodes" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sensorActivity}>
              <defs>
                <linearGradient id="sa1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.15 215)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="oklch(0.7 0.15 215)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Area type="monotone" dataKey="gas" stroke="oklch(0.7 0.15 215)" strokeWidth={2} fill="url(#sa1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="glass rounded-2xl p-6">
          <div className="mb-2">
            <h3 className="text-base font-semibold">Food Waste Reduction</h3>
            <p className="text-xs text-muted-foreground">Cumulative savings (kg)</p>
          </div>
          <div className="mt-4 text-4xl font-semibold tabular-nums text-gradient-brand">142.6 kg</div>
          <div className="mt-1 text-xs text-safe">↑ 23% vs last month</div>
          <div className="mt-6 space-y-3">
            {[
              { label: "Dairy", val: 92 },
              { label: "Vegetables", val: 78 },
              { label: "Fruits", val: 64 },
              { label: "Bakery", val: 41 },
            ].map(r => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs"><span>{r.label}</span><span className="font-semibold tabular-nums">{r.val}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-safe rounded-full" style={{ width: `${r.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold">Freshness Heatmap</h3>
          <p className="text-xs text-muted-foreground">Category vs day of week — darker green = higher freshness</p>
        </div>
        <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
          <div />
          <div className="grid grid-cols-7 gap-1.5">
            {heatCols.map(c => <div key={c} className="text-center text-muted-foreground font-medium">{c}</div>)}
          </div>
          {heat.map(row => (
            <Fragment key={row.r}>
              <div className="text-muted-foreground font-medium self-center">{row.r}</div>
              <div className="grid grid-cols-7 gap-1.5">
                {row.vals.map((v, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md grid place-items-center text-[10px] font-semibold text-white"
                    style={{ background: `oklch(${0.5 + v / 250} 0.2 ${130 + v / 4})` }}
                    title={`${v}%`}
                  >
                    {v}
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Most monitored */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-base font-semibold mb-4">Most Monitored Foods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {foods.slice(0, 8).map(f => (
            <div key={f.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/40">
              <img src={f.image} alt={f.name} className="size-10 rounded-lg object-cover" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{f.name}</div>
                <div className="text-[11px] text-muted-foreground">{f.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}

       {/* Shelf Life Forecast Section */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <ChartCard title="Shelf Life Trend Forecast" subtitle="Predicted SAFE, CAUTION, UNSAFE distribution" className="lg:col-span-2">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={shelfLifeForecast}>
               <defs>
                 <linearGradient id="slf-safe" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="oklch(0.72 0.22 148)" stopOpacity={0.4} />
                   <stop offset="100%" stopColor="oklch(0.72 0.22 148)" stopOpacity={0} />
                 </linearGradient>
                 <linearGradient id="slf-caution" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="oklch(0.82 0.18 85)" stopOpacity={0.35} />
                   <stop offset="100%" stopColor="oklch(0.82 0.18 85)" stopOpacity={0} />
                 </linearGradient>
                 <linearGradient id="slf-unsafe" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="oklch(0.62 0.27 25)" stopOpacity={0.35} />
                   <stop offset="100%" stopColor="oklch(0.62 0.27 25)" stopOpacity={0} />
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
               <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
               <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
               <Tooltip contentStyle={tipStyle} />
               <Area type="monotone" dataKey="safe" stroke="oklch(0.72 0.22 148)" strokeWidth={2.5} fill="url(#slf-safe)" />
               <Area type="monotone" dataKey="caution" stroke="oklch(0.82 0.18 85)" strokeWidth={2} fill="url(#slf-caution)" />
               <Area type="monotone" dataKey="unsafe" stroke="oklch(0.62 0.27 25)" strokeWidth={2} fill="url(#slf-unsafe)" />
             </AreaChart>
           </ResponsiveContainer>
         </ChartCard>

         <ChartCard title="Spoilage Timeline" subtitle="Average days until UNSAFE state">
           <div className="space-y-4">
             {[
               { name: "Dairy", days: 2.5, color: "gradient-safe" },
               { name: "Meat", days: 1.8, color: "gradient-warn" },
               { name: "Fruits", days: 4.2, color: "gradient-ocean" },
               { name: "Vegetables", days: 3.5, color: "gradient-primary" },
               { name: "Bakery", days: 5.0, color: "gradient-mint" },
             ].map(item => (
               <div key={item.name}>
                 <div className="flex items-center justify-between mb-1 text-xs">
                   <span className="font-medium">{item.name}</span>
                   <span className="text-muted-foreground">{item.days}d</span>
                 </div>
                 <div className="h-2 rounded-full bg-muted overflow-hidden">
                   <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.days / 5) * 100}%` }} />
                 </div>
               </div>
             ))}
           </div>
         </ChartCard>
       </div>

       {/* Food Degradation Forecast */}
       <ChartCard title="Food Degradation Forecast" subtitle="Predicted freshness levels over next 24 hours">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={foodDegradationForecast}>
             <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
             <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
             <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
             <Tooltip contentStyle={tipStyle} />
             <Legend wrapperStyle={{ fontSize: 11 }} />
             <Line type="monotone" dataKey="milk" stroke="oklch(0.78 0.22 150)" strokeWidth={2} dot={false} name="Milk" />
             <Line type="monotone" dataKey="greens" stroke="oklch(0.7 0.15 215)" strokeWidth={2} dot={false} name="Leafy Greens" />
             <Line type="monotone" dataKey="rice" stroke="oklch(0.88 0.16 165)" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Cooked Rice" />
             <Line type="monotone" dataKey="chicken" stroke="oklch(0.62 0.27 25)" strokeWidth={2} dot={false} name="Chicken" />
           </LineChart>
         </ResponsiveContainer>
       </ChartCard>      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}


