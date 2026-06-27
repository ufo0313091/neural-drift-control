import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import {
  useLogs,
  URGE_LABELS,
  TRIGGER_LABELS,
  useProfile,
  type Trigger,
  type UrgeType,
} from "@/lib/storage";
import { calcTypeStat } from "@/lib/protocols";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  const logs = useLogs();
  const { profile } = useProfile();

  const hourBuckets = useMemo(() => {
    const arr = new Array(24).fill(0) as number[];
    for (const l of logs) arr[new Date(l.ts).getHours()] += 1;
    return arr;
  }, [logs]);
  const maxHour = Math.max(1, ...hourBuckets);

  const triggerStats = useMemo(() => {
    const m = new Map<Trigger, { count: number; sumIntensity: number }>();
    for (const l of logs) {
      if (!l.trigger) continue;
      const cur = m.get(l.trigger) ?? { count: 0, sumIntensity: 0 };
      cur.count += 1;
      cur.sumIntensity += l.intensity;
      m.set(l.trigger, cur);
    }
    return [...m.entries()].map(([k, v]) => ({ trigger: k, count: v.count, avg: v.sumIntensity / v.count })).sort((a, b) => b.count - a.count);
  }, [logs]);

  const typeStats = useMemo(() => {
    const m = new Map<UrgeType, { total: number; overcome: number }>();
    for (const l of logs) {
      const cur = m.get(l.type) ?? { total: 0, overcome: 0 };
      cur.total += 1;
      const isOvercome = l.outcome === "calmed" || l.outcome === "reduced" || (!l.outcome && l.waitedSec >= 60);
      if (isOvercome) cur.overcome += 1;
      m.set(l.type, cur);
    }
    return [...m.entries()].map(([type, v]) => ({ type, ...v })).sort((a, b) => b.total - a.total);
  }, [logs]);

  const total = logs.length;
  const avgWait = useMemo(() => {
    const arr = logs.filter((l) => l.waitedSec > 0);
    if (!arr.length) return 0;
    return Math.round(arr.reduce((s, l) => s + l.waitedSec, 0) / arr.length);
  }, [logs]);

  const primaryType = profile?.primaryType;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">脳のマップ</p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">欲求の波の記録</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">あなたの脳のパターンを、責めずに眺める場所。</p>
        </header>

        <section className="mt-8 grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <Stat label="合計" value={String(total)} unit="件" />
          <Stat label="平均待機" value={String(avgWait)} unit="秒" />
          <Stat label="ピーク時刻" value={total ? String(hourBuckets.indexOf(maxHour)).padStart(2, "0") : "—"} unit="時" />
        </section>

        <section className="mt-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="mb-4 text-[10px] tracking-wider text-muted-foreground">24時間の分布</h2>
          <div className="rounded-2xl border border-border bg-white/5 p-5">
            <div className="flex h-32 items-end gap-[3px]">
              {hourBuckets.map((v, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-accent/60 to-accent transition-all"
                  style={{ height: `${(v / maxHour) * 100}%`, opacity: v === 0 ? 0.08 : 1, boxShadow: v === maxHour && v > 0 ? "0 0 12px oklch(0.88 0.16 200 / 0.5)" : "none" }} />
              ))}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[9px] text-muted-foreground">
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
          </div>
        </section>

        {typeStats.length > 0 && (
          <section className="mt-8 animate-fade-in-up" style={{ animationDelay: "280ms" }}>
            <h2 className="mb-4 text-[10px] tracking-wider text-muted-foreground">衝動の種類別</h2>
            <div className="space-y-3">
              {typeStats.map(({ type, total: tot, overcome }) => {
                const tStat = overcome > 0 ? calcTypeStat(overcome, type) : null;
                const isPrimary = type === primaryType;
                return (
                  <div key={type} className={`rounded-2xl border p-4 ${isPrimary ? "border-accent/40 bg-accent/[0.04]" : "border-border bg-white/5"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{URGE_LABELS[type]}</span>
                        {isPrimary && <span className="rounded-full border border-accent/40 px-1.5 py-0.5 text-[9px] text-accent">主目標</span>}
                      </div>
                      <span className="text-[11px] text-muted-foreground">記録 {tot}回 ・ 乗り越え {overcome}回</span>
                    </div>
                    {tStat && (
                      <p className="mt-1 text-[11px] text-accent">{tStat.icon} {tStat.label} {tStat.display}</p>
                    )}
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full bg-accent transition-all" style={{ width: `${tot > 0 ? (overcome / tot) * 100 : 0}%` }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                      <span>乗り越え率</span>
                      <span>{tot > 0 ? Math.round((overcome / tot) * 100) : 0}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-8 animate-fade-in-up" style={{ animationDelay: "360ms" }}>
          <h2 className="mb-4 text-[10px] tracking-wider text-muted-foreground">引き金の分析</h2>
          {triggerStats.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-white/[0.02] p-4 text-center text-xs text-muted-foreground">観察を重ねると、あなたの引き金が静かに見えてきます。</p>
          ) : (
            <div className="space-y-2">
              {triggerStats.map((s) => (
                <div key={s.trigger} className="rounded-2xl border border-border bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{TRIGGER_LABELS[s.trigger]}</span>
                    <span className="font-mono text-[11px] text-accent">平均 {s.avg.toFixed(1)} ・ {s.count}回</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full bg-accent" style={{ width: `${(s.count / triggerStats[0].count) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomNav />
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white/5 p-4">
      <p className="mb-2 text-[10px] tracking-wider text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-light tabular-nums">{value}</span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
