import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import {
  useLogs,
  useProfile,
  URGE_LABELS,
  TRIGGER_LABELS,
  formatElapsed,
} from "@/lib/storage";

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

  // Real-time clock since this page mounted (or since last log if newer)
  const mountTimeRef = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const today = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return logs.filter((l) => l.ts >= start.getTime());
  }, [logs]);

  const lastLog = logs[0];
  // since last log (or since onboarding if no logs)
  const referenceTs = lastLog?.ts ?? profile?.createdAt ?? mountTimeRef.current;
  const elapsedMs = Math.max(0, now - referenceTs);
  const elapsedLabel = formatElapsed(elapsedMs);

  // 安定度: recovers from 0% to 100% over 6 hours since last log
  const SIX_H = 6 * 60 * 60 * 1000;
  const stability = lastLog
    ? Math.min(100, Math.round((elapsedMs / SIX_H) * 100))
    : 100;

  const triggerCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of logs.slice(0, 50)) {
      if (l.trigger) m.set(l.trigger, (m.get(l.trigger) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [logs]);
  const primaryTrigger = triggerCounts[0]?.[0] as keyof typeof TRIGGER_LABELS | undefined;

  // Insight: combine trigger + urge type + hour pattern
  const insight = useMemo(() => {
    if (logs.length < 3) return null;
    const recent = logs.slice(0, 30);
    // find dominant trigger+type
    const pair = new Map<string, number>();
    for (const l of recent) {
      const k = `${l.trigger ?? "?"}|${l.type}`;
      pair.set(k, (pair.get(k) ?? 0) + 1);
    }
    const top = [...pair.entries()].sort((a, b) => b[1] - a[1])[0];
    if (!top || top[1] < 2) return null;
    const [trg, typ] = top[0].split("|");
    if (trg === "?") return null;
    const t = TRIGGER_LABELS[trg as keyof typeof TRIGGER_LABELS];
    const u = URGE_LABELS[typ as keyof typeof URGE_LABELS];
    // hour pattern
    const hours = recent.map((l) => new Date(l.ts).getHours());
    const lateCount = hours.filter((h) => h >= 22 || h < 4).length;
    const hint =
      lateCount / hours.length > 0.4
        ? "22時以降に集中する傾向があります。"
        : "時間帯は分散しています。";
    return `あなたは「${t}」を感じた時、「${u}」の衝動が起きやすい。${hint}`;
  }, [logs]);

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!profile) return null;

  const showFutureCTA = !profile.vision || !profile.altActions?.length;

  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden bg-background text-foreground">
      <header className="w-full max-w-md animate-fade-in-up px-6 pt-12 pb-6">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[10px] tracking-widest text-muted-foreground">現在の状態</p>
            <h1 className="text-2xl font-light tracking-tight">手動運転モード</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-widest text-accent">前回から</p>
            <p className="text-2xl font-light tracking-tighter tabular-nums">
              {elapsedLabel}
            </p>
            <p className="mt-1 text-[10px] tracking-widest text-muted-foreground">
              安定度 <span className="text-foreground/90 tabular-nums">{stability}%</span>
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

        {showFutureCTA && (
          <Link
            to="/future"
            className="mt-4 flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/5 p-4 transition-colors hover:border-accent/60"
          >
            <div>
              <p className="text-[10px] tracking-widest text-accent">まずはここを設定</p>
              <p className="mt-1 text-sm font-medium">未来の自分を、設計する →</p>
            </div>
            <div className="size-2 rounded-full bg-accent shadow-[var(--accent-glow)]" />
          </Link>
        )}
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
          className="mt-12 max-w-[28ch] animate-fade-in-up text-center text-sm font-light leading-relaxed text-muted-foreground"
          style={{ animationDelay: "400ms" }}
        >
          記録するほど、あなたの脳のパターンが見えてきます。
          <br />
          責めずに、ただ眺める。
        </p>
      </main>

      <section
        className="w-full max-w-md animate-fade-in-up space-y-4 px-6 pb-32"
        style={{ animationDelay: "600ms" }}
      >
        {insight && (
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-4">
            <p className="mb-1.5 text-[10px] tracking-widest text-accent">脳の発見</p>
            <p className="text-sm font-light leading-relaxed">{insight}</p>
            <Link
              to="/map"
              className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              詳しく見る →
            </Link>
          </div>
        )}

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
