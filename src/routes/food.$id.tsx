import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { GaugeRing } from "@/components/widgets/gauge-ring";
import { ShelfLifePredictionSection } from "@/components/widgets/shelf-life-prediction";
import { FreshnessReasonCard } from "@/components/widgets/freshness-reason-card";
import { foods, statusTone, getShelfLifePrediction } from "@/lib/freshguard-data";
import { ArrowLeft, Wind, Droplets, Thermometer, Sparkles, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/food/$id")({
  loader: ({ params }) => {
    const food = foods.find(f => f.id === params.id);
    if (!food) throw notFound();
    return food;
  },
  component: FoodDetailsPage,
});

function FoodDetailsPage() {
  const food = Route.useLoaderData();
  const tone = statusTone(food.status);

  const timeline = Array.from({ length: 14 }, (_, i) => ({
    t: `${14 - i}d`,
    fresh: Math.max(20, Math.min(100, food.freshness + Math.round(Math.sin(i / 2) * 8) + i)),
  })).reverse();

  const RecIcon = food.status === "SAFE" ? CheckCircle2 : food.status === "CAUTION" ? AlertTriangle : XCircle;
  const recText = food.status === "SAFE" ? "Fresh — safe to consume" : food.status === "CAUTION" ? "Consume soon" : "Discard immediately";

  return (
    <div className="space-y-6">
      <Link to="/food-monitoring" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to monitoring</Link>

      <PageHeader title={food.name} subtitle={`${food.category} · Device ${food.device} · Updated ${food.updatedAt}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl overflow-hidden lg:col-span-2 relative">
          <img src={food.image} alt={food.name} className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
          <div className={cn("absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider text-white", tone.grad)}>
            {food.status}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <div className="text-2xl font-semibold">{food.freshness}% Fresh</div>
              <div className="text-xs opacity-80">AI confidence {food.confidence}%</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gradient-mesh">
          <GaugeRing value={food.freshness} size={200} label="Freshness Score" sublabel={`${food.confidence}% AI confidence`} />
        </div>
      </div>

      {/* Sensor grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard icon={Wind} label="MQ135 Gas" value={`${food.gas}`} unit="ppm" tone="primary" />
        <SensorCard icon={Droplets} label="pH" value={food.ph.toFixed(2)} unit="" tone="ocean" />
        <SensorCard icon={Thermometer} label="Temperature" value={`${food.temperature}`} unit="°C" tone="warn" />
        <SensorCard icon={Droplets} label="Humidity" value={`${food.humidity}`} unit="%" tone="ocean" />
      </div>

      {/* Recommendation + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={cn("glass rounded-2xl p-6 relative overflow-hidden border-2", tone.border)}>
          <div className={cn("absolute -top-12 -right-12 size-40 rounded-full opacity-25 blur-2xl", tone.grad)} />
          <div className={cn("size-12 rounded-2xl grid place-items-center text-white", tone.grad)}>
            <RecIcon className="size-6" />
          </div>
          <div className="mt-4 text-lg font-semibold">{recText}</div>
          <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Based on combined sensor readings and the latest spoilage model retraining, the AI recommends acting on this item according to your facility's policy.
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-foreground/80">
            <Sparkles className="size-3.5 text-primary" /> Model v2.4 · {food.confidence}% confidence
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold">Freshness Timeline</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.22 150)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.22 150)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="fresh" stroke="oklch(0.72 0.22 148)" strokeWidth={2.5} fill="url(#tg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Shelf Life Prediction & Freshness Reason */}
      {getShelfLifePrediction(food.id) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ShelfLifePredictionSection prediction={getShelfLifePrediction(food.id)!} />
          <FreshnessReasonCard food={food} />
        </div>
      )}
    </div>
  );
}

function SensorCard({ icon: Icon, label, value, unit, tone }: { icon: any; label: string; value: string; unit: string; tone: "primary" | "ocean" | "warn" }) {
  const grads = { primary: "gradient-safe", ocean: "gradient-ocean", warn: "gradient-warn" };
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className={cn("absolute -top-10 -right-10 size-28 rounded-full opacity-20 blur-2xl", grads[tone])} />
      <div className={cn("size-10 rounded-xl grid place-items-center text-white", grads[tone])}>
        <Icon className="size-5" />
      </div>
      <div className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}<span className="text-sm text-muted-foreground ml-1">{unit}</span></div>
    </div>
  );
}
