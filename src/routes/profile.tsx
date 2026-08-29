import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { devices } from "@/lib/freshguard-data";
import { Mail, MapPin, Briefcase, HardDrive, Activity, Cpu, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — FreshGuard AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Your account, project, and connected systems" />

      <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden gradient-mesh">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <Avatar className="size-24 ring-4 ring-background shadow-[var(--shadow-glow)]">
            <AvatarImage src="https://i.pravatar.cc/200?img=12" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">Aarav Sharma</h2>
            <p className="text-sm text-muted-foreground">Lead Engineer · FreshGuard AI</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 justify-center md:justify-start text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" />aarav@freshguard.ai</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />Bengaluru, IN</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase className="size-3.5" />Joined Mar 2024</span>
            </div>
          </div>
          <button className="h-10 px-5 rounded-xl gradient-safe text-white text-sm font-medium">Edit Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold mb-4">Project Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Field label="Project" value="FreshGuard AI" />
            <Field label="Version" value="v2.4.1" />
            <Field label="Environment" value="Production" />
            <Field label="Region" value="asia-south1" />
            <Field label="Database" value="Firebase Realtime" />
            <Field label="Model" value="freshguard-cnn-v2" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2"><HardDrive className="size-4" />Storage Usage</h3>
          <div className="relative h-32 grid place-items-center">
            <svg viewBox="0 0 100 100" className="-rotate-90 size-32">
              <circle cx="50" cy="50" r="42" fill="none" stroke="color-mix(in oklab, var(--muted-foreground) 15%, transparent)" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.72 0.22 148)" strokeWidth="10" strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={(1 - 0.62) * 2 * Math.PI * 42} />
            </svg>
            <div className="absolute text-center">
              <div className="text-2xl font-semibold tabular-nums">62%</div>
              <div className="text-[10px] text-muted-foreground">6.2 / 10 GB</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">Sensor logs + image cache</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-base font-semibold mb-3 inline-flex items-center gap-2"><Activity className="size-4" />System Status</h3>
          <div className="space-y-3">
            {[
              { name: "API Gateway", state: "Operational" },
              { name: "Firebase Realtime DB", state: "Operational" },
              { name: "AI Inference", state: "Operational" },
              { name: "Notification Service", state: "Operational" },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm">{s.name}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-safe"><CheckCircle2 className="size-3.5" />{s.state}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold mb-3 inline-flex items-center gap-2"><Cpu className="size-4" />Connected Devices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {devices.map(d => (
              <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background/60">
                <div className={`size-9 rounded-xl grid place-items-center text-white ${d.status === "online" ? "gradient-safe" : "gradient-danger"}`}>
                  <Cpu className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.sensors.join(" · ")}</div>
                </div>
                <span className={`text-[10px] uppercase font-bold ${d.status === "online" ? "text-safe" : "text-danger"}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}
