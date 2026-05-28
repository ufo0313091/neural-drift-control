import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useLogs, useProfile, URGE_LABELS, TRIGGER_LABELS } from "@/lib/storage";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { profile, ready } = useProfile();
  const logs = useLogs();

  useEffect(() => {
    if (ready && !profile) navigate({ to: "/onboarding", replace: true });
  }, [ready, profile, navigate]);

  const today = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return logs.filter((l) => l.ts >= start.getTime());
  }, [logs]);

  const lastLog = logs[0];
  const minutesSince = lastLog
    ? Math.max(0, Math.round((Date.now() - lastLog.ts) / 60000))
    : null;

  const triggerCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of logs.slice(0, 50)) {
      if (l.trigger) m.set(l.trigger, (m.get(l.trigger) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [logs]);
  const primaryTrigger = triggerCounts[0]?.[0] as keyof typeof TRIGGER_LABELS | undefined;

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden bg-background text-foreground">
      <header className="w-full max-w-md animate-fade-in-up px-6 pt-12 pb-6">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[10px] tracking-widest text-muted-foreground">現在の状態</p>
            <h1 className="text-2xl font-light tracking-tight">手動運転モード</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-widest text-accent">
              {minutesSince !== null ? "前回から" : "安定度"}
            </p>
            <p className="text-2xl font-light tracking-tighter">
              {minutesSince !== null ? (
                <>
                  {minutesSince}
                  <span className="ml-0.5 text-sm text-muted-foreground">分</span>
                </>
              ) : (
                <>
                  100<span className="ml-0.5 text-sm text-muted-foreground">%</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-white/[0.04] p-4">
          <div className="size-2 animate-pulse rounded-full bg-accent shadow-[var(--accent-glow)]" />
          <div className="flex-1">
            <p className="mb-1 text-[10px] tracking-wider text-muted-foreground">あなたの理由</p>
            <p className="text-sm font-light leading-relaxed">「{profile.reason}」</p>
          </div>
        </div>
      </header>

      <main className="relative flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="size-72 animate-pulse-ring rounded-full border border-accent/20" />
          <div
            className="absolute size-96 animate-pulse-ring rounded-full border border-accent/10"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <Link
          to="/surf"
          className="group relative flex size-64 animate-fade-in-up flex-col items-center justify-center rounded-full border border-white/10 bg-black transition-colors duration-700 hover:border-accent/40 active:scale-[0.98]"
          style={{ animationDelay: "200ms" }}
        >
          <span className="mb-3 text-[10px] tracking-[0.3em] text-accent">そっと観察する</span>
          <span className="text-4xl font-extralight tracking-tight">衝動がきた</span>
          <div className="mt-4 flex items-end gap-1">
            <div className="h-3 w-1 rounded-full bg-accent/40" />
            <div className="h-5 w-1 rounded-full bg-accent shadow-[var(--accent-glow)]" />
            <div className="h-3 w-1 rounded-full bg-accent/40" />
          </div>
          <div className="absolute inset-0 rounded-full bg-accent/5 opacity-0 transition-opacity group-active:opacity-100" />
        </Link>

        <p
          className="mt-12 max-w-[24ch] animate-fade-in-up text-center text-sm font-light leading-relaxed text-muted-foreground"
          style={{ animationDelay: "400ms" }}
        >
          欲求の波がきたら、
          <br />
          一度だけ、静かに観察してみよう。
        </p>
      </main>

      <section
        className="w-full max-w-md animate-fade-in-up space-y-4 px-6 pb-32"
        style={{ animationDelay: "600ms" }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-white/5 p-4">
            <p className="mb-2 text-[10px] tracking-wider text-muted-foreground">今日の観察</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-light tabular-nums">
                {String(today.length).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-muted-foreground">回</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white/5 p-4">
            <p className="mb-2 text-[10px] tracking-wider text-muted-foreground">主な引き金</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {primaryTrigger ? TRIGGER_LABELS[primaryTrigger] : "—"}
              </span>
              {primaryTrigger && (
                <span className="text-[10px] text-accent">
                  ×{triggerCounts[0]?.[1]}
                </span>
              )}
            </div>
          </div>
        </div>

        {lastLog ? (
          <div className="rounded-2xl border border-border bg-white/5 p-4">
            <p className="mb-3 text-[10px] tracking-wider text-muted-foreground">最新の記録</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium">{URGE_LABELS[lastLog.type]}</p>
                <p className="text-xs text-muted-foreground">
                  強度 {lastLog.intensity} ・{" "}
                  {lastLog.trigger ? TRIGGER_LABELS[lastLog.trigger] : "—"}
                </p>
              </div>
              <span className="text-[10px] tracking-wider text-accent">観察済</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-white/[0.02] p-4 text-center text-xs text-muted-foreground">
            最初の観察が、ここに静かに残ります。
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
}
