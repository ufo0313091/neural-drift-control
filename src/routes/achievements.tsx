import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useLogs, useProfile } from "@/lib/storage";
import { ACHIEVEMENTS, getEarnedIds, CATEGORY_LABELS, type Achievement } from "@/lib/achievements";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const logs = useLogs();
  const { profile } = useProfile();
  const earnedIds = useMemo(() => new Set(getEarnedIds(logs, profile)), [logs, profile]);

  const byCategory = useMemo(() => {
    const map = new Map<Achievement["category"], Achievement[]>();
    for (const a of ACHIEVEMENTS) {
      const list = map.get(a.category) ?? [];
      list.push(a);
      map.set(a.category, list);
    }
    return map;
  }, []);

  const earnedCount = earnedIds.size;
  const total = ACHIEVEMENTS.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">実績</p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">バッジ</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            積み重ねてきた証。 {earnedCount} / {total} 獲得
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${(earnedCount / total) * 100}%` }}
            />
          </div>
        </header>

        <div className="mt-8 space-y-6">
          {(["overcome", "streak", "courage", "explore", "habit"] as Achievement["category"][]).map((cat) => {
            const items = byCategory.get(cat) ?? [];
            return (
              <section key={cat} className="animate-fade-in-up">
                <h2 className="mb-3 text-[10px] tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="space-y-2">
                  {items.map((a) => {
                    const earned = earnedIds.has(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                          earned
                            ? "border-accent/30 bg-accent/[0.05]"
                            : "border-border bg-white/[0.02] opacity-40"
                        }`}
                      >
                        <div
                          className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-lg ${
                            earned
                              ? "border-accent/40 bg-accent/10"
                              : "border-white/10 bg-white/[0.04]"
                          }`}
                        >
                          {earned ? a.icon : "—"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${earned ? "text-foreground" : "text-muted-foreground"}`}>
                            {a.title}
                          </p>
                          <p className="mt-0.5 text-xs font-light leading-snug text-muted-foreground">
                            {a.desc}
                          </p>
                        </div>
                        {earned && (
                          <div className="size-2 shrink-0 rounded-full bg-accent shadow-[var(--accent-glow)]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
