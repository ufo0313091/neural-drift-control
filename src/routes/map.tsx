import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import {
  useLogs,
  URGE_LABELS,
  TRIGGER_LABELS,
  type Trigger,
  type UrgeType,
} from "@/lib/storage";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  const logs = useLogs();

  const hourBuckets = useMemo(() => {
    const arr = new Array(24).fill(0) as number[];
    for (const l of logs) {
      const h = new Date(l.ts).getHours();
      arr[h] += 1;
    }
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
    return [...m.entries()]
      .map(([k, v]) => ({ trigger: k, count: v.count, avg: v.sumIntensity / v.count }))
      .sort((a, b) => b.count - a.count);
  }, [logs]);

  const typeStats = useMemo(() => {
    const m = new Map<UrgeType, number>();
    for (const l of logs) m.set(l.type, (m.get(l.type) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [logs]);
  const total = logs.length;

  const avgWait = useMemo(() => {
    const arr = logs.filter((l) => l.waitedSec > 0);
    if (!arr.length) return 0;
    return Math.round(arr.reduce((s, l) => s + l.waitedSec, 0) / arr.length);
  }, [logs]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Neural Map
          </p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">衝動マップ</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            あなたの脳のパターンを観察する。
          </p>
        </header>

        <section className="mt-8 grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <Stat label="Total" value={String(total)} unit="LOGS" />
          <Stat label="Avg wait" value={String(avgWait)} unit="SEC" />
          <Stat
            label="Peak hour"
            value={
              total
                ? String(hourBuckets.indexOf(maxHour)).padStart(2, "0")
                : "—"
            }
            unit="H"
          />
        </section>

        <section className="mt-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            24h Distribution
          </h2>
          <div className="rounded-2xl border border-border bg-white/5 p-5">
            <div className="flex h-32 items-end gap-[3px]">
              {hourBuckets.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-accent/60 to-accent transition-all"
                  style={{
                    height: `${(v / maxHour) * 100}%`,
                    opacity: v === 0 ? 0.08 : 1,
                    boxShadow: v === maxHour && v > 0 ? "0 0 12px oklch(0.88 0.16 200 / 0.5)" : "none",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[9px] text-muted-foreground">
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
            </div>
          </div>
        </section>

        <section className="mt-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Trigger Analysis
          </h2>
          {triggerStats.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-white/[0.02] p-4 text-center text-xs text-muted-foreground">
              データが蓄積されると、AI分析がここに現れます。
            </p>
          ) : (
            <div className="space-y-2">
              {triggerStats.map((s) => (
                <div
                  key={s.trigger}
                  className="rounded-2xl border border-border bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{TRIGGER_LABELS[s.trigger]}</span>
                    <span className="font-mono text-[11px] text-accent">
                      avg {s.avg.toFixed(1)} ・ ×{s.count}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${(s.count / triggerStats[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {typeStats.length > 0 && (
          <section className="mt-8 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <h2 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              By Urge Type
            </h2>
            <div className="rounded-2xl border border-border bg-white/5 p-5">
              {typeStats.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2 text-sm">
                  <span>{URGE_LABELS[k]}</span>
                  <span className="font-mono text-xs text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white/5 p-4">
      <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-light tabular-nums">{value}</span>
        <span className="font-mono text-[9px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}