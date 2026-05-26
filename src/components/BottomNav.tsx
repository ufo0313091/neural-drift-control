import { Link, useLocation } from "@tanstack/react-router";
import { Home, Activity, BookOpen, Settings as SettingsIcon } from "lucide-react";

const items = [
  { to: "/", label: "HOME", icon: Home },
  { to: "/map", label: "MAP", icon: Activity },
  { to: "/codex", label: "INDEX", icon: BookOpen },
  { to: "/settings", label: "DATA", icon: SettingsIcon },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-md items-center justify-around px-6">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={
                "flex flex-col items-center gap-1.5 transition-colors " +
                (active ? "text-accent" : "text-muted-foreground hover:text-foreground")
              }
            >
              <Icon className="size-4" strokeWidth={1.5} />
              <span className="font-mono text-[10px] tracking-tighter">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}