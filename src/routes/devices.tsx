import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { devices } from "@/lib/freshguard-data";
import { Cpu, Wifi, WifiOff, Battery, Thermometer, Wind, Droplets, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/devices")({
  head: () => ({ meta: [{ title: "IoT Devices — FreshGuard AI" }] }),
  component: DevicesPage,
});

const sensorIcons: Record<string, any> = { MQ135: Wind, DHT11: Thermometer, pH: Droplets };

function DevicesPage() {
  const online = devices.filter(d => d.status === "online");
  const offline = devices.filter(d => d.status === "offline");

  return (
    <div className="space-y-6">
      <PageHeader title="IoT Devices" subtitle="Health and connectivity for every NodeMCU and attached sensor" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile icon={Cpu} label="Connected" value={devices.length} tone="primary" />
        <StatTile icon={Wifi} label="Online" value={online.length} tone="primary" />
        <StatTile icon={WifiOff} label="Offline" value={offline.length} tone="danger" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {devices.map(d => {
          const isOn = d.status === "online";
          return (
            <div key={d.id} className="glass rounded-2xl p-5 relative overflow-hidden hover:shadow-[var(--shadow-soft)] transition">
              <div className={cn("absolute -top-10 -right-10 size-32 rounded-full opacity-20 blur-2xl", isOn ? "gradient-safe" : "gradient-danger")} />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{d.id}</div>
                  <div className="text-base font-semibold leading-tight mt-0.5">{d.name}</div>
                </div>
                <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase", isOn ? "bg-safe/15 text-safe" : "bg-danger/15 text-danger")}>
                  <CircleDot className="size-3" />{d.status}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <Battery className="size-3.5 text-muted-foreground" />
                  <span className="font-semibold tabular-nums">{d.battery}%</span>
                </div>
                <div className="text-xs text-muted-foreground">Uptime <span className="font-medium text-foreground">{d.uptime}</span></div>
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full", isOn ? "gradient-safe" : "gradient-danger")} style={{ width: `${d.battery}%` }} />
              </div>

              <div className="mt-4 pt-4 border-t border-border/60">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Sensors</div>
                <div className="flex flex-wrap gap-2">
                  {d.sensors.map(s => {
                    const Icon = sensorIcons[s] ?? Cpu;
                    return (
                      <div key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/60 border border-border/60 text-xs">
                        <Icon className="size-3.5 text-primary" />
                        <span className="font-medium">{s}</span>
                        <span className={cn("size-1.5 rounded-full ml-1", isOn ? "bg-safe pulse-dot" : "bg-danger")} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "primary" | "danger" }) {
  const grad = tone === "primary" ? "gradient-safe" : "gradient-danger";
  return (
    <div className="glass rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
      <div className={cn("absolute -top-8 -right-8 size-28 rounded-full opacity-20 blur-2xl", grad)} />
      <div className={cn("size-12 rounded-2xl grid place-items-center text-white", grad)}><Icon className="size-6" /></div>
      <div>
        <div className="text-xs uppercase text-muted-foreground tracking-wider">{label}</div>
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
