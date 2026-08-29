import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Salad,
  LineChart,
  Bell,
  History,
  Sparkles,
  Cpu,
  Settings,
  UserCircle,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/food-monitoring", label: "Food Monitoring", icon: Salad },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/history", label: "History", icon: History },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { to: "/devices", label: "IoT Devices", icon: Cpu },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: UserCircle },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2 px-4 py-6 border-r border-sidebar-border bg-sidebar/60 backdrop-blur-xl sticky top-0 h-screen">
      <Link to="/" className="flex items-center gap-3 px-2 mb-6">
        <div className="relative">
          <div className="size-10 rounded-2xl gradient-safe grid place-items-center shadow-[var(--shadow-glow)]">
            <Leaf className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-safe ring-2 ring-sidebar pulse-dot" />
        </div>
        <div>
          <div className="font-semibold tracking-tight text-[15px] leading-none">FreshGuard <span className="text-gradient-brand">AI</span></div>
          <div className="text-[11px] text-muted-foreground mt-1">Food Safety OS</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
              )}
              <Icon className={cn("size-[18px] transition-transform group-hover:scale-110", active && "text-primary")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="glass rounded-2xl p-4 gradient-mesh">
          <div className="text-xs font-semibold text-foreground">System Health</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-safe pulse-dot" />
            <span className="text-xs text-muted-foreground">All systems nominal</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[94%] gradient-safe rounded-full" />
          </div>
          <div className="mt-1.5 text-[10px] text-muted-foreground">Uptime 99.94%</div>
        </div>
      </div>
    </aside>
  );
}
