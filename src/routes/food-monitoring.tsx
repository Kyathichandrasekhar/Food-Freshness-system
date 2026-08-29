import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { FoodCard } from "@/components/widgets/food-card";
import { foods } from "@/lib/freshguard-data";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/food-monitoring")({
  head: () => ({ meta: [{ title: "Food Monitoring — FreshGuard AI" }] }),
  component: FoodMonitoringPage,
});

const filters = ["All", "SAFE", "CAUTION", "UNSAFE"] as const;

function FoodMonitoringPage() {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const list = f === "All" ? foods : foods.filter(x => x.status === f);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Monitoring"
        subtitle="Live freshness reading for every item across your facility"
        actions={
          <>
            <button className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-border hover:bg-accent text-sm"><SlidersHorizontal className="size-4" />Sort</button>
            <button className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-border hover:bg-accent text-sm"><Filter className="size-4" />Filters</button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map(x => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={cn(
              "px-4 h-9 rounded-full text-xs font-semibold transition",
              f === x ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "glass hover:bg-accent",
            )}
          >
            {x} {x !== "All" && <span className="ml-1 opacity-70">({foods.filter(y => y.status === x).length})</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map(food => <FoodCard key={food.id} food={food} />)}
      </div>
    </div>
  );
}
