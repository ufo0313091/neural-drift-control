import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  URGE_LABELS,
  TRIGGER_LABELS,
  OUTCOME_LABELS,
  addLog,
  updateLog,
  uid,
  useProfile,
  type UrgeType,
  type Trigger,
  type Outcome,
} from "@/lib/storage";

export const Route = createFileRoute("/surf")({
  component: SurfPage,
});

type Phase = "select" | "trigger" | "intensity" | "surf" | "result" | "done";

const URGE_OPTIONS = Object.entries(URGE_LABELS) as [UrgeType, string][];
const TRIGGER_OPTIONS = Object.entries(TRIGGER_LABELS) as [Trigger, string][];

const SURF_DURATION = 90;

const ALTERNATIVES = [
  "水を一杯飲む",
  "深呼吸を5回",
  "窓の外を10秒見る",
  "スクワット15回",
  "肩を回してストレッチ",
  "歯を磨く",
  "白湯を入れる",
  "1分だけ外を歩く",
  "ガムを噛む",
  "腕立て10回",
  "日光を浴びる",
  "顔を冷水で洗う",
];

const ENCOURAGE = [
  "波は永遠には続きません。",
  "今、観察できているだけで前進。",
  "ピークは必ず過ぎ去ります。",
  "我慢ではなく、観察を。",
  "脳の信号と、あなたは別のもの。",
];

function SurfPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [phase, setPhase] = useState<Phase>("select");
  const [type, setType] = useState<UrgeType | null>(null);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [logId, setLogId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(SURF_DURATION);
  const startRef = useRef<number | null>(null);

  const alternative = useMemo(
    () => ALTERNATIVES[Math.floor(Math.random() * ALTERNATIVES.length)],
    [phase],
  );
  const encouragement = useMemo(
    () => ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)],
    [phase],
  );

  useEffect(() => {
    if (phase !== "surf") return;
    startRef.current = Date.now();
    setRemaining(SURF_DURATION);
    const i = setInterval(() => {
      const elapsed = (Date.now() - (startRef.current ?? Date.now())) / 1000;
      const rem = Math.max(0, SURF_DURATION - elapsed);
      setRemaining(rem);
      if (rem <= 0) {
        clearInterval(i);
        setPhase("result");
      }
    }, 100);
    return () => clearInterval(i);
  }, [phase]);

  const startSurf = () => {
    if (!type) return;
    const id = uid();
    setLogId(id);
    addLog({
      id,
      ts: Date.now(),
      type,
      intensity,
      trigger: trigger ?? undefined,
      waitedSec: 0,
    });
    setPhase("surf");
  };

  const finishWithOutcome = (outcome: Outcome) => {
    if (logId) {
      const waited = startRef.current
        ? Math.round((Date.now() - startRef.current) / 1000)
        : SURF_DURATION;
      updateLog(logId, { outcome, waitedSec: waited });
    }
    setPhase("done");
  };

  const progress = 1 - remaining / SURF_DURATION;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <button
        onClick={() => navigate({ to: "/" })}
        className="absolute top-6 right-6 z-20 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        ✕ Exit
      </button>

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pt-16 pb-10">
        {phase === "select" && (
          <div className="animate-fade-in-up">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Capture / 01
            </p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">
              今、どんな衝動?
            </h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              ラベルをつけるだけで、前頭前野が動き始めます。
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {URGE_OPTIONS.map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => {
                    setType(k);
                    setPhase("trigger");
                  }}
                  className="rounded-2xl border border-border bg-white/5 p-5 text-left text-sm font-medium transition-colors hover:border-accent/40 hover:bg-accent/5"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "trigger" && (
          <div className="animate-fade-in-up">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Capture / 02
            </p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">引き金は?</h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              判らなければスキップして大丈夫。
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {TRIGGER_OPTIONS.map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => {
                    setTrigger(k);
                    setPhase("intensity");
                  }}
                  className="rounded-2xl border border-border bg-white/5 p-4 text-left text-sm hover:border-white/20"
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPhase("intensity")}
              className="mt-6 w-full text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Skip →
            </button>
          </div>
        )}

        {phase === "intensity" && (
          <div className="flex flex-1 flex-col animate-fade-in-up">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Capture / 03
            </p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">強度は?</h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              1（さざ波） 〜 10（津波）
            </p>
            <div className="mt-12 flex flex-1 flex-col items-center justify-center">
              <div className="text-7xl font-extralight tabular-nums tracking-tighter text-accent">
                {intensity}
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="mt-10 w-full accent-[oklch(0.88_0.16_200)]"
              />
              <div className="mt-2 flex w-full justify-between font-mono text-[10px] text-muted-foreground">
                <span>01</span>
                <span>10</span>
              </div>
            </div>
            <button
              onClick={startSurf}
              className="mt-10 w-full rounded-full bg-accent py-4 text-base font-medium text-accent-foreground shadow-[var(--accent-glow)] transition-opacity hover:opacity-90"
            >
              90秒、波に乗る
            </button>
          </div>
        )}

        {phase === "surf" && (
          <div className="flex flex-1 flex-col items-center justify-between gap-8 py-6">
            <div className="text-center animate-fade-in-up">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Surfing Mode
              </p>
              <p className="mt-3 text-lg font-light">{encouragement}</p>
            </div>

            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="size-72 -rotate-90">
                <circle cx="100" cy="100" r="90" stroke="oklch(1 0 0 / 0.06)" strokeWidth="2" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="oklch(0.88 0.16 200)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - progress)}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-100"
                  style={{ filter: "drop-shadow(0 0 6px oklch(0.88 0.16 200 / 0.6))" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-32 animate-breath rounded-full bg-accent/15 blur-2xl" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-extralight tabular-nums tracking-tighter">
                  {Math.ceil(remaining)}
                </span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Seconds
                </span>
              </div>
            </div>

            {profile?.reason && (
              <div className="w-full max-w-xs rounded-2xl border border-border bg-white/5 p-4 text-center">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  あなたの理由
                </p>
                <p className="text-sm font-light leading-relaxed">「{profile.reason}」</p>
              </div>
            )}

            <div className="w-full rounded-2xl border border-accent/30 bg-accent/5 p-4 text-center">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                Alternative
              </p>
              <p className="text-base font-medium">{alternative}</p>
            </div>

            <button
              onClick={() => setPhase("result")}
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Skip ahead →
            </button>
          </div>
        )}

        {phase === "result" && (
          <div className="flex flex-1 flex-col justify-center animate-fade-in-up">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Observation Complete
            </p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">
              今、どう感じる?
            </h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              どの答えでも、責められることはありません。
            </p>
            <div className="mt-10 space-y-3">
              {(Object.keys(OUTCOME_LABELS) as Outcome[]).map((o) => (
                <button
                  key={o}
                  onClick={() => finishWithOutcome(o)}
                  className="w-full rounded-2xl border border-border bg-white/5 p-5 text-left text-base font-medium transition-colors hover:border-accent/40 hover:bg-accent/5"
                >
                  {OUTCOME_LABELS[o]}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center animate-fade-in-up">
            <div className="flex size-20 items-center justify-center rounded-full border border-accent/40 shadow-[var(--accent-glow)]">
              <div className="size-3 rounded-full bg-accent" />
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Logged
            </p>
            <h1 className="mt-3 text-3xl font-extralight tracking-tight">
              次の1回を、整えよう。
            </h1>
            <p className="mt-3 max-w-[28ch] text-sm font-light leading-relaxed text-muted-foreground">
              記録できた時点で前進です。脳のパターンが、少しずつ可視化されていきます。
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-10 rounded-full border border-border bg-white/5 px-6 py-3 text-sm font-medium hover:border-accent/40"
            >
              ホームへ戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}