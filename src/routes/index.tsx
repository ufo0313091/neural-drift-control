import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import {
  useLogs,
  useProfile,
  calcStreak,
  calcOvercomeCount,
  URGE_LABELS,
  type UrgeType,
} from "@/lib/storage";
import { calcTypeStat } from "@/lib/protocols";

export const Route = createFileRoute("/")({
  component: Home,
});

function StatPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
      <span className="text-base">{icon}</span>
      <span className="text-lg font-light tabular-nums text-foreground">{value}</span>
      <span className="text-[9px] tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const { profile, ready } = useProfile();
  const logs = useLogs();

  useEffect(() => {
    if (ready && !profile) navigate({ to: "/onboarding", replace: true });
  }, [ready, profile, navigate]);

  const streak = useMemo(() => calcStreak(logs), [logs]);
  const overcomeCount = useMemo(() => calcOvercomeCount(logs), [logs]);
  const primaryType: UrgeType = profile?.primaryType ?? "other";
  const typeStat = overcomeCount > 0 ? calcTypeStat(overcomeCount, primaryType) : null;

  const showFutureCTA = !profile?.vision || !profile?.altActions?.length;

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden bg-background text-foreground">
      <div className="w-full max-w-md px-6 pt-12 pb-32 space-y-6">

        {/* Header */}
        <header className="animate-fade-in-up space-y-1">
          <p className="text-[10px] tracking-[0.3em] text-accent">衝動コントロール</p>
          <h1 className="text-2xl font-extralight tracking-tight">
            {URGE_LABELS[primaryType]}の衝動と向き合う
          </h1>
        </header>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <StatPill icon="🔥" label="連続日数" value={`${streak}日`} />
          <StatPill icon="✦" label="乗り越えた" value={`${overcomeCount}回`} />
          {typeStat ? (
            <StatPill icon={typeStat.icon} label={typeStat.label} value={typeStat.display} />
          ) : (
            <StatPill icon="—" label="積み上げ中" value="—" />
          )}
        </div>

        {/* Main card button */}
        <Link to="/surf" className="group w-full animate-fade-in-up block" style={{ animationDelay: "160ms" }}>
          <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] px-8 py-10 text-center shadow-[0_2px_24px_rgba(0,0,0,0.5)] transition-all duration-300 active:scale-[0.98] active:bg-white/[0.09]">
            <p className="mb-3 text-[10px] tracking-[0.3em] text-accent">そっと観察する</p>
            <p className="text-4xl font-extralight tracking-tight">衝動がきた</p>
            <div className="mt-5 flex justify-center gap-1.5">
              <div className="size-1.5 rounded-full bg-accent/50" />
              <div className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_oklch(0.88_0.16_200/0.8)]" />
              <div className="size-1.5 rounded-full bg-accent/50" />
            </div>
            <p className="mt-4 text-[10px] tracking-widest text-muted-foreground">タップして開始</p>
          </div>
        </Link>

        {/* Empty state explanation */}
        {logs.length === 0 && (
          <div className="animate-fade-in-up rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm" style={{ animationDelay: "240ms" }}>
            <p className="mb-2 text-[10px] tracking-widest text-accent">なぜ90秒？</p>
            <p className="font-light leading-relaxed text-muted-foreground">
              神経科学の研究で、感情の波のピークは<span className="text-foreground">約90秒</span>で収まることがわかっています。衝動が来た瞬間にここを開いて、波が引くのをただ観察してみましょう。
            </p>
          </div>
        )}

        {/* Add to Home Screen banner */}
        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <AddToHomeScreen />
        </div>

        {/* Future CTA */}
        {showFutureCTA && (
          <Link
            to="/future"
            className="animate-fade-in-up flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/5 p-4 transition-colors hover:border-accent/60"
            style={{ animationDelay: "360ms" }}
          >
            <div>
              <p className="text-[10px] tracking-widest text-accent">未来設計</p>
              <p className="mt-1 text-sm font-medium">なりたい自分を設計する →</p>
            </div>
            <div className="size-2 rounded-full bg-accent shadow-[var(--accent-glow)]" />
          </Link>
        )}

        {/* Reason card */}
        <div className="animate-fade-in-up rounded-2xl border border-border bg-white/[0.04] p-4" style={{ animationDelay: "420ms" }}>
          <p className="mb-1 text-[10px] tracking-wider text-muted-foreground">あなたの理由</p>
          <p className="text-sm font-light leading-relaxed">「{profile.reason}」</p>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
