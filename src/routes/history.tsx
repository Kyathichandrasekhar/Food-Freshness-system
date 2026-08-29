import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { history, statusTone, shelfLifeHistory } from "@/lib/freshguard-data";
import { Download, Search, Calendar, List, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — FreshGuard AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [view, setView] = useState<"table" | "timeline" | "calendar">("table");

  return (
    <div className="space-y-6">
      <PageHeader
        title="History"
        subtitle="Complete log of every sensor reading and AI prediction"
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input className="h-10 pl-9 pr-3 rounded-xl border border-border bg-background/60 text-sm w-56" placeholder="Search..." />
            </div>
            <button className="inline-flex items-center gap-2 h-10 px-3 rounded-xl gradient-safe text-white text-sm font-medium"><Download className="size-4" />Export</button>
          </>
        }
      />

      <div className="inline-flex p-1 rounded-xl glass">
        {([["table", List], ["timeline", Clock], ["calendar", Calendar]] as const).map(([v, Icon]) => (
          <button key={v} onClick={() => setView(v)} className={cn("inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium capitalize transition", view === v ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground")}>
            <Icon className="size-3.5" />{v}
          </button>
        ))}
      </div>

      {view === "table" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Food</th>
                  <th className="text-left px-5 py-3 font-medium">Freshness</th>
                  <th className="text-left px-5 py-3 font-medium">Gas</th>
                  <th className="text-left px-5 py-3 font-medium">pH</th>
                  <th className="text-left px-5 py-3 font-medium">Prediction</th>
                  <th className="text-left px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.map(h => {
                  const tone = statusTone(h.prediction);
                  return (
                    <tr key={h.id} className="hover:bg-accent/30 transition">
                      <td className="px-5 py-3 font-medium">{h.food}</td>
                      <td className="px-5 py-3 tabular-nums">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className={cn("h-full rounded-full", tone.grad)} style={{ width: `${v}%` }} />
                          </div>
                          <span className="text-xs font-semibold">{h.freshness}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">{h.gas} ppm</td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">{h.ph.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={cn("text-[10px] font-bold uppercase px-2 py-1 rounded-full text-white", tone.grad)}>{h.prediction}</span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{h.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "timeline" && (
        <div className="glass rounded-2xl p-6">
          <div className="relative pl-8 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border">
            {history.slice(0, 12).map(h => {
              const tone = statusTone(h.prediction);
              return (
                <div key={h.id} className="relative">
                  <span className={cn("absolute -left-[22px] top-1 size-3 rounded-full ring-4 ring-background", tone.grad)} />
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{h.food}</span>
                    <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white", tone.grad)}>{h.prediction}</span>
                    <span className="text-[11px] text-muted-foreground ml-auto">{h.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Freshness {h.freshness}% • Gas {h.gas} ppm • pH {h.ph.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="text-muted-foreground font-semibold pb-2">{d}</div>)}
            {Array.from({ length: 35 }).map((_, i) => {
              const v = Math.round(40 + Math.random() * 60);
              const day = i - 2;
              return (
                <div key={i} className={cn("aspect-square rounded-lg p-1.5 text-left text-[11px] border border-border/60", day > 0 && day <= 30 ? "bg-background/60" : "opacity-30")}>
                  <div className="text-muted-foreground">{day > 0 && day <= 30 ? day : ""}</div>
                  {day > 0 && day <= 30 && (
                    <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-safe rounded-full" style={{ width: `${v}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Shelf Life History</h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Food</th>
                  <th className="text-left px-5 py-3 font-medium">Remaining Safe</th>
                  <th className="text-left px-5 py-3 font-medium">Fresh Until</th>
                  <th className="text-left px-5 py-3 font-medium">Confidence</th>
                  <th className="text-left px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {shelfLifeHistory.slice(0, 8).map(e => (
                  <tr key={e.id} className="hover:bg-accent/30 transition">
                    <td className="px-5 py-3 font-medium">{e.foodName}</td>
                    <td className="px-5 py-3 tabular-nums text-muted-foreground">{e.prediction.remainingSafeTimeFormatted}</td>
                    <td className="px-5 py-3 tabular-nums">{e.prediction.expectedFreshUntil}</td>
                    <td className="px-5 py-3"><span className="text-xs font-semibold">{e.prediction.aiConfidence}%</span></td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{e.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

