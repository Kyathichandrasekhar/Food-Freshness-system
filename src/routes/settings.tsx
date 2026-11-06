import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/app-shell";
import { Bell, SlidersHorizontal, Brain, Database, Palette, Cpu } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useFirebaseConnection } from "@/hooks/use-firebase-data";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FreshGuard AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [threshold, setThreshold] = useState([60]);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Tune notifications, AI thresholds, and device behaviour" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card icon={Bell} title="Notifications" subtitle="How and when FreshGuard alerts you">
          <Row label="Critical alerts" desc="Email + push notifications" defaultOn />
          <Row label="Warning alerts" desc="Push only" defaultOn />
          <Row label="Weekly summary" desc="Every Monday 9:00 AM" />
          <Row label="Device offline" desc="If a node is offline for >5 min" defaultOn />
        </Card>

        <Card icon={SlidersHorizontal} title="Alert Thresholds" subtitle="Trigger boundaries for AI alerts">
          <div className="space-y-5">
            <ThresholdRow label="Freshness alert below" value={`${threshold[0]}%`}>
              <Slider value={threshold} onValueChange={setThreshold} max={100} step={1} />
            </ThresholdRow>
            <ThresholdRow label="MQ135 gas" value="450 ppm" />
            <ThresholdRow label="Temperature max" value="10°C" />
            <ThresholdRow label="Humidity max" value="75%" />
          </div>
        </Card>

        <Card icon={Brain} title="AI Settings" subtitle="Model behaviour and inference">
          <Row label="Edge inference" desc="Run model on NodeMCU when possible" defaultOn />
          <Row label="Auto-retrain weekly" desc="Schedule retraining at 02:00 UTC" defaultOn />
          <Row label="Beta predictions" desc="Use experimental v2.5 endpoint" />
          <Row label="Share anonymous telemetry" desc="Helps improve global model" />
        </Card>

        <FirebaseCard />

        <Card icon={Palette} title="Theme" subtitle="Appearance preferences">
          <Row label="Dark mode" desc="Sync with system or override" />
          <Row label="High-contrast charts" desc="Improves readability" />
          <Row label="Reduce motion" desc="Disables animations" />
        </Card>

        <Card icon={Cpu} title="Device Configuration" subtitle="Defaults for new nodes">
          <FormRow label="Sample interval" value="15 s" />
          <FormRow label="Heartbeat" value="30 s" />
          <FormRow label="OTA channel" value="stable" />
        </Card>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, subtitle, children }: { icon: any; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-xl gradient-safe grid place-items-center"><Icon className="size-5 text-white" /></div>
        <div>
          <div className="text-base font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function ThresholdRow({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs font-semibold tabular-nums">{value}</div>
      </div>
      {children ?? <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full w-2/3 gradient-safe rounded-full" /></div>}
    </div>
  );
}

function FormRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <input defaultValue={value} readOnly className="w-full h-9 px-3 rounded-lg border border-border bg-background/60 text-sm font-mono text-muted-foreground" />
    </div>
  );
}

function FirebaseCard() {
  const { isConnected, isSupported } = useFirebaseConnection();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      if (isConnected) {
        setTestResult("Online — Realtime Database connected successfully.");
      } else {
        setTestResult("Offline / Connecting — Verifying WebSocket stream...");
      }
    }, 800);
  };

  return (
    <Card icon={Database} title="Firebase Configuration" subtitle="Realtime database connection & sync">
      <FormRow label="Project ID" value="foodfreshnessmonitor" />
      <FormRow label="Realtime DB" value="foodfreshnessmonitor-default-rtdb.firebaseio.com" />
      <FormRow label="Storage Bucket" value="foodfreshnessmonitor.firebasestorage.app" />
      
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${
              isConnected
                ? "bg-safe/15 text-safe"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isConnected ? "bg-safe animate-pulse" : "bg-muted-foreground"
              }`}
            />
            {isConnected ? "Connected (Live)" : "Local / Offline"}
          </span>
        </div>

        {testResult && (
          <div className="text-xs p-2 rounded-lg bg-accent/50 text-foreground mb-2">
            {testResult}
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={testing}
          className="h-9 px-3 rounded-lg gradient-safe text-white text-xs font-medium hover:opacity-95 transition disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test connection"}
        </button>
      </div>
    </Card>
  );
}
