import { Link } from "@tanstack/react-router";
import type { Food } from "@/lib/freshguard-data";
import { statusTone } from "@/lib/freshguard-data";
import { cn } from "@/lib/utils";
import { Clock, Thermometer, Droplets, Wind } from "lucide-react";

export function FoodCard({ food }: { food: Food }) {
  const tone = statusTone(food.status);
  return (
    <Link
      to="/food/$id"
      params={{ id: food.id }}
      className="group glass rounded-2xl overflow-hidden hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
        <div className={cn("absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-white shadow-md", tone.grad)}>
          {food.status}
        </div>
        <div className="absolute top-3 right-3 glass-strong rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums">
          {food.freshness}%
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-base font-semibold leading-tight">{food.name}</div>
            <div className="text-[11px] opacity-80">{food.category}</div>
          </div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-4 gap-2 text-center">
        <Stat icon={Wind} value={food.gas} label="ppm" />
        <Stat icon={Droplets} value={food.ph.toFixed(1)} label="pH" />
        <Stat icon={Thermometer} value={`${food.temperature}°`} label="temp" />
        <Stat icon={Droplets} value={`${food.humidity}%`} label="hum" />
      </div>
      <div className="px-4 pb-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="size-3" />{food.updatedAt}</span>
        <span className="font-medium text-foreground/70">AI {food.confidence}%</span>
      </div>
    </Link>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className="size-3.5 text-muted-foreground" />
      <div className="text-xs font-semibold tabular-nums">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
