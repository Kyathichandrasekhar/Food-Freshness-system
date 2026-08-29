import { useEffect, useState } from "react";
import { Bell, Search, Sun, Moon, Wifi } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const [now, setNow] = useState(new Date());
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border/60">
      <div className="flex items-center gap-3 px-4 md:px-8 h-16">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search foods, devices, alerts…"
            className="pl-9 h-10 bg-background/60 border-border/60 rounded-xl"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full bg-safe/10 px-3 py-1.5 border border-safe/20">
            <Wifi className="size-3.5 text-safe" />
            <span className="text-xs font-medium text-safe">5 devices online</span>
            <span className="size-1.5 rounded-full bg-safe pulse-dot" />
          </div>

          <div className="hidden sm:flex flex-col items-end text-right leading-tight">
            <span className="text-sm font-semibold tabular-nums">{time}</span>
            <span className="text-[11px] text-muted-foreground">{date}</span>
          </div>

          <button
            onClick={() => setDark((d) => !d)}
            className="size-10 grid place-items-center rounded-xl border border-border/60 hover:bg-accent transition"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <button className="relative size-10 grid place-items-center rounded-xl border border-border/60 hover:bg-accent transition">
            <Bell className="size-4" />
            <Badge className="absolute -top-1 -right-1 size-5 rounded-full p-0 grid place-items-center bg-danger text-danger-foreground border-2 border-background text-[10px]">3</Badge>
          </button>

          <Avatar className="size-10 ring-2 ring-primary/20">
            <AvatarImage src="https://i.pravatar.cc/100?img=12" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
