import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  URGE_LABELS,
  TRIGGER_LABELS,
  OUTCOME_LABELS,
  addLog,
  updateLog,
  uid,
  useLogs,
  useProfile,
  type UrgeType,
  type Trigger,
  type Outcome,
} from "@/lib/storage";
import {
  voiceCalmingLines,
  voiceVisionPrefix,
  voiceClosingLine,
  suggestOneAction,
  buildFeedback,
} from "@/lib/voice";

export const Route = createFileRoute("/surf")({
  component: SurfPage,
});

type Phase = "select" | "trigger" | "intensity" | "surf" | "result" | "acted" | "done";

const URGE_OPTIONS = Object.entries(URGE_LABELS) as [UrgeType, string][];
const TRIGGER_OPTIONS = Object.entries(TRIGGER_LABELS) as [Trigger, string][];

const SURF_DURATION = 90;

const DEFAULT_ALTERNATIVES = [
  "水を一杯飲む",
  "深呼吸を5回",
  "窓の外を10秒見る",
  "肩を回してストレッチ",
  "歯を磨く",
  "白湯を入れる",
  "1分だけ外を歩く",
];

function SurfPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const logs = useLogs();
  const [phase, setPhase] = useState<Phase>("select");
  const [type, setType] = useState<UrgeType | null>(null);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [logId, setLogId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(SURF_DURATION);
  const startRef = useRef<number | null>(null);
  const [omakase, setOmakase] = useState<string>("");

  const altActions = profile?.altActions?.length
    ? profile.altActions
    : DEFAULT_ALTERNATIVES;

  // Recompute おまかせ when type changes (chosen at urge selection)
  useEffect(() => {
    if (type) setOmakase(suggestOneAction(type, altActions));
  }, [type, altActions]);

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

  const elapsed = SURF_DURATION - remaining;

  // Phase A/B/C messages driven by voice persona
  const voice = profile?.voice ?? "calm";
  const stageA = useMemo(() => voiceCalmingLines(voice), [voice]);
  const stageBPrefix = useMemo(() => voiceVisionPrefix(voice), [voice]);
  const stageCLine = useMemo(() => voiceClosingLine(voice), [voice]);

  // Which stage are we in (0–30 / 30–60 / 60–90)
  const stage: "A" | "B" | "C" = elapsed < 30 ? "A" : elapsed < 60 ? "B" : "C";
  const stageALineIndex = Math.min(stageA.length - 1, Math.floor(elapsed / 10));
  const currentText =
    stage === "A"
      ? stageA[stageALineIndex]
      : stage === "B"
        ? stageBPrefix
        : stageCLine;

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
    let waited = SURF_DURATION;
    if (logId) {
      waited = startRef.current
        ? Math.round((Date.now() - startRef.current) / 1000)
        : SURF_DURATION;
      updateLog(logId, { outcome, waitedSec: waited });
    }
    if (outcome === "acted") setPhase("acted");
    else setPhase("done");
  };

  // Build feedback shown on "done"
  const feedback = useMemo(() => {
    if (phase !== "done") return [];
    const waited = startRef.current
      ? Math.round((Date.now() - startRef.current) / 1000)
      : SURF_DURATION;
    const prev = logs.find((l) => l.id !== logId && l.waitedSec > 0)?.waitedSec;
    return buildFeedback({
      waitedSec: waited,
      prevWaitedSec: prev,
      hour: new Date().getHours(),
      type: type ?? "other",
      voice,
      nextAction: omakase || altActions[0],
    });
  }, [phase, logId, logs, type, voice, omakase, altActions]);

  const progress = 1 - remaining / SURF_DURATION;
  // breathing rhythm: 4 in / 6 out → 10s cycle, map to scale 0.85–1.15
  const breath = useMemo(() => {
    const t = (elapsed % 10) / 10;
    // sinusoidal breathing
    const s = 1 + Math.sin(t * Math.PI * 2) * 0.13;
    const phaseLabel = t < 0.4 ? "吸って" : t < 0.5 ? "止めて" : "吐いて";
    return { scale: s, label: phaseLabel };
  }, [elapsed]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <button
        onClick={() => navigate({ to: "/" })}
        className="absolute top-6 right-6 z-20 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        ✕ 閉じる
      </button>

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pt-16 pb-10">
        {phase === "select" && (
          <div className="animate-fade-in-up">
            <p className="text-[10px] tracking-[0.3em] text-accent">記録 / 01</p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">
              今、どんな衝動がきた?
            </h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              名前をつけるだけで、前頭前野が静かに動き始めます。
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
            <p className="text-[10px] tracking-[0.3em] text-accent">記録 / 02</p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">引き金は?</h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              わからなくて大丈夫。スキップもできます。
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
              スキップ →
            </button>
          </div>
        )}

        {phase === "intensity" && (
          <div className="flex flex-1 flex-col animate-fade-in-up">
            <p className="text-[10px] tracking-[0.3em] text-accent">記録 / 03</p>
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
              90秒、波を眺める
            </button>
          </div>
        )}

        {phase === "surf" && (
          <div className="relative flex flex-1 flex-col items-center justify-between gap-6 py-4">
            {/* Deep ocean background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 60%, oklch(0.22 0.06 230 / 0.5), transparent 70%)",
                }}
              />
              <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 animate-deep-breath rounded-full bg-accent/10 blur-3xl" />
            </div>

            <div className="text-center animate-fade-in-up">
              <p className="text-[10px] tracking-[0.3em] text-accent">観察モード</p>
              <p className="mt-3 text-base font-light text-foreground/90 transition-opacity duration-700">
                {currentText}
              </p>
            </div>

            <div className="relative flex items-center justify-center">
              {/* tide ripples */}
              <div className="absolute size-72 animate-tide rounded-full border border-accent/30" />
              <div
                className="absolute size-72 animate-tide rounded-full border border-accent/20"
                style={{ animationDelay: "2.6s" }}
              />
              <div
                className="absolute size-72 animate-tide rounded-full border border-accent/15"
                style={{ animationDelay: "5.2s" }}
              />

              {/* timer ring */}
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
                  style={{ filter: "drop-shadow(0 0 8px oklch(0.88 0.16 200 / 0.7))" }}
                />
              </svg>

              {/* breathing orb */}
              <div
                className="absolute size-40 rounded-full bg-accent/20 blur-2xl transition-transform duration-1000 ease-in-out"
                style={{ transform: `scale(${breath.scale})` }}
              />
              <div
                className="absolute size-32 rounded-full border border-accent/40 bg-accent/5 transition-transform duration-1000 ease-in-out"
                style={{ transform: `scale(${breath.scale})` }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-extralight tabular-nums tracking-tighter">
                  {Math.ceil(remaining)}
                </span>
                <span className="mt-1 text-[10px] tracking-[0.3em] text-accent">
                  {breath.label}
                </span>
              </div>
            </div>

            {/* Stage-aware card under the orb */}
            {stage === "A" && profile?.reason && (
              <div className="w-full max-w-xs animate-fade-in-up rounded-2xl border border-border bg-white/5 p-4 text-center backdrop-blur-sm">
                <p className="mb-1 text-[10px] tracking-widest text-muted-foreground">
                  まず、思い出してみよう
                </p>
                <p className="text-sm font-light leading-relaxed">「{profile.reason}」</p>
              </div>
            )}

            {stage === "B" && (
              <div className="w-full animate-fade-in-up rounded-2xl border border-accent/30 bg-accent/5 p-4 backdrop-blur-sm">
                <p className="mb-1 text-[10px] tracking-widest text-accent">未来設計</p>
                {profile?.vision ? (
                  <p className="text-sm font-light leading-relaxed">{profile.vision}</p>
                ) : (
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">
                    この習慣を手放せたら、あなたはどんな自分になれますか？
                    <br />（あとで「未来設計」から設定できます）
                  </p>
                )}
                {profile?.voice === "future" && profile.futureSelfWords && (
                  <p className="mt-3 border-t border-accent/20 pt-3 text-xs italic leading-relaxed text-foreground/80">
                    未来の自分から：「{profile.futureSelfWords}」
                  </p>
                )}
              </div>
            )}

            {stage === "C" && (
              <div className="w-full animate-fade-in-up space-y-3">
                <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-center backdrop-blur-sm">
                  <p className="mb-1 text-[10px] tracking-widest text-accent">おまかせの一手</p>
                  <p className="text-lg font-medium">{omakase}</p>
                  <button
                    onClick={() => type && setOmakase(suggestOneAction(type, altActions))}
                    className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                  >
                    別の提案 →
                  </button>
                </div>
                {profile?.antiVision && (
                  <div className="rounded-2xl border border-border bg-white/5 p-3 text-center text-xs font-light leading-relaxed text-muted-foreground">
                    続けたままの未来：{profile.antiVision}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setPhase("result")}
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              先へ進む →
            </button>
          </div>
        )}

        {phase === "result" && (
          <div className="flex flex-1 flex-col justify-center animate-fade-in-up">
            <p className="text-[10px] tracking-[0.3em] text-accent">観察完了</p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">
              今、どう感じる?
            </h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              どの答えでも、ここでは責められません。記録できた時点で前進です。
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

        {phase === "acted" && (
          <div className="flex flex-1 flex-col justify-center animate-fade-in-up">
            <p className="text-[10px] tracking-[0.3em] text-accent">気づけた、それだけで前進</p>
            <h1 className="mt-3 text-3xl font-extralight tracking-tight">
              次の波が来たら、これを試そう。
            </h1>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
              実行した自分を責めなくていい。脳の癖は、何度も上書きすることで変わります。次の1回のために、いまできる小さな行動を眺めてみてください。
            </p>
            <div className="mt-8 space-y-2">
              {altActions.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-white/5 p-4"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/40 font-mono text-[10px] text-accent">
                    {i + 1}
                  </div>
                  <p className="text-sm font-light">{a}</p>
                </div>
              ))}
            </div>
            {!profile?.altActions?.length && (
              <button
                onClick={() => navigate({ to: "/future" })}
                className="mt-6 w-full rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm font-medium hover:border-accent/60"
              >
                自分専用の対策を設定する →
              </button>
            )}
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-6 w-full rounded-full border border-border bg-white/5 py-3 text-sm font-medium hover:border-accent/40"
            >
              ホームへ戻る
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center animate-fade-in-up">
            <div className="flex size-20 items-center justify-center rounded-full border border-accent/40 shadow-[var(--accent-glow)]">
              <div className="size-3 rounded-full bg-accent" />
            </div>
            <p className="mt-8 text-[10px] tracking-[0.3em] text-accent">記録完了</p>
            <h1 className="mt-3 text-3xl font-extralight tracking-tight">
              気づけた自分を、まず認めよう。
            </h1>
            <p className="mt-3 max-w-[28ch] text-sm font-light leading-relaxed text-muted-foreground">
              結果がどうであれ、観察できたことが脳を変えていきます。次の1回を、静かに整えていきましょう。
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
