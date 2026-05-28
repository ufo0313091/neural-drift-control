import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useProfile, type Profile } from "@/lib/storage";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const GOALS = [
  "暴食を減らしたい",
  "間食のお菓子を辞めたい",
  "SNSを見る時間を減らしたい",
  "夜更かしを終わらせたい",
  "怒りに振り回されないようにしたい",
  "ネガティブ思考を減らしたい",
  "感情の波と上手く付き合いたい",
  "禁煙したい",
  "お酒との距離を整えたい",
  "衝動買いを止めたい",
  "ポルノ依存から抜け出したい",
];

const VOICES: { id: Profile["voice"]; label: string; desc: string }[] = [
  { id: "kind", label: "優しい", desc: "そっと寄り添う" },
  { id: "calm", label: "冷静", desc: "客観的な視点" },
  { id: "coach", label: "コーチ風", desc: "前向きに後押し" },
  { id: "scientist", label: "科学者風", desc: "脳の仕組みで説明" },
  { id: "future", label: "未来の自分", desc: "ひとつ先のあなた（次の画面で設定）" },
];

const REASON_EXAMPLES = [
  "自信を持ちたい。好きな人がいて、その人に堂々と気持ちを伝えたいから。今の自分を、少しでも好きになれるようになりたい。",
  "SNSを見る時間を減らしたい。その時間を、未来のための自己投資に回したい。一度きりの人生を、スクロールだけで終わらせたくないから。",
  "深夜の暴食を減らしたい。朝起きたときに自己嫌悪になる人生を、もう終わらせたい。身体を軽くして、自分を大切に扱える人間になりたい。",
  "お酒の量を減らしたい。家族と過ごす朝の時間を、もっと丁寧に味わいたいから。",
];

function Onboarding() {
  const navigate = useNavigate();
  const { save } = useProfile();
  // 0=welcome, 1=goal, 2=what-app-does, 3=voice, 4=reason, 5=first-breath
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [reason, setReason] = useState("");
  const [voice, setVoice] = useState<Profile["voice"]>("calm");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [step]);

  const finalGoal = customGoal.trim() || goal;

  const finish = () => {
    save({
      goal: finalGoal,
      reason: reason.trim(),
      voice,
      createdAt: Date.now(),
      introSeen: true,
    });
    if (voice === "future") navigate({ to: "/future", replace: true });
    else navigate({ to: "/", replace: true });
  };

  const TOTAL = 6;
  const next = () => setStep((s) => Math.min(TOTAL - 1, s + 1));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pt-12 pb-10">
        {step > 0 && (
          <header className="mb-8 animate-fade-in-up">
            <p className="text-[10px] tracking-[0.3em] text-accent">
              {String(step).padStart(2, "0")} / {String(TOTAL - 1).padStart(2, "0")}
            </p>
            <h1 className="mt-2 text-3xl font-extralight tracking-tight">
              {step === 1 && "直したい習慣を、ひとつ"}
              {step === 2 && "このアプリでできること"}
              {step === 3 && "あなたに語りかける声"}
              {step === 4 && "なぜ、変わりたい?"}
              {step === 5 && "30秒だけ、呼吸しよう"}
            </h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">
              {step === 1 && "“今いちばん気になっているもの”を選んでください。"}
              {step === 2 && "難しい使い方はありません。"}
              {step === 3 && "衝動の瞬間に、そっと現れる声です。"}
              {step === 4 && "“目標”ではなく、“人生の理由”を一言で。"}
              {step === 5 && "最初の成功体験を、ここで作ります。"}
            </p>
          </header>
        )}

        <main className="flex-1 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          {step === 0 && <Welcome onStart={next} />}

          {step === 1 && (
            <div className="space-y-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGoal(g);
                    setCustomGoal("");
                  }}
                  className={
                    "w-full rounded-2xl border p-4 text-left text-sm font-medium transition-colors " +
                    (goal === g && !customGoal
                      ? "border-accent/50 bg-accent/10 text-foreground"
                      : "border-border bg-white/5 text-foreground/90 hover:border-white/20")
                  }
                >
                  {g}
                </button>
              ))}
              <input
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="または、自分の言葉で…"
                className="mt-4 w-full rounded-2xl border border-border bg-white/5 p-4 text-sm placeholder:text-muted-foreground/60 focus:border-accent/50 focus:outline-none"
              />
            </div>
          )}

          {step === 2 && (
            <ul className="space-y-2">
              {[
                ["衝動のピークを、90秒でやり過ごす", "観察モード"],
                ["脳のクセを、AIが少しずつ可視化", "傾向分析"],
                ["タイプ別に、効く対策をAIが提案", "おまかせ対策"],
                ["“失敗”の概念がない、責めない設計", "セルフコンパッション"],
              ].map(([t, tag]) => (
                <li
                  key={t}
                  className="rounded-2xl border border-border bg-white/5 p-4"
                >
                  <p className="text-[10px] tracking-widest text-accent">{tag}</p>
                  <p className="mt-1 text-sm font-light leading-relaxed">{t}</p>
                </li>
              ))}
            </ul>
          )}

          {step === 3 && (
            <div className="space-y-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={
                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors " +
                    (voice === v.id
                      ? "border-accent/50 bg-accent/10"
                      : "border-border bg-white/5 hover:border-white/20")
                  }
                >
                  <div>
                    <p className="text-sm font-medium">{v.label}</p>
                    <p className="text-xs text-muted-foreground">{v.desc}</p>
                  </div>
                  <div
                    className={
                      "size-2 rounded-full " +
                      (voice === v.id ? "bg-accent shadow-[var(--accent-glow)]" : "bg-white/10")
                    }
                  />
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-accent/20 bg-accent/[0.04] p-4">
                <p className="mb-2 text-[10px] tracking-widest text-accent">書き方のヒント</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  「○○したい。なぜなら〜だから。だから〜になりたい。」
                  <br />
                  感情・人・未来 — 自分の心が動く具体的な言葉を入れてください。
                </p>
              </div>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={7}
                placeholder="例：自信を持ちたい。好きな人がいて、その人に堂々と気持ちを伝えたいから。今の自分を、少しでも好きになれるようになりたい。"
                className="w-full resize-none rounded-2xl border border-border bg-white/5 p-4 text-base font-light leading-relaxed placeholder:text-muted-foreground/40 focus:border-accent/50 focus:outline-none"
              />
              <p className="px-1 text-[10px] tracking-wider text-muted-foreground">
                / この言葉は、衝動の瞬間にそっと画面に戻ってきます
              </p>

              <div className="space-y-2">
                <p className="px-1 text-[10px] tracking-widest text-muted-foreground">
                  書けないときは、お手本から始めてもいい
                </p>
                {REASON_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReason(ex)}
                    className="block w-full rounded-2xl border border-border bg-white/[0.03] p-3 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && <BreathSuccess onDone={finish} />}
        </main>

        {step > 0 && step < 5 && (
          <footer className="mt-10 flex items-center justify-between gap-4">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
            >
              ← 戻る
            </button>
            <button
              onClick={next}
              disabled={
                (step === 1 && !finalGoal) || (step === 4 && !reason.trim())
              }
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              次へ →
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="relative mb-12 flex items-center justify-center">
        <div className="absolute size-48 animate-pulse-ring rounded-full border border-accent/20" />
        <div
          className="absolute size-64 animate-pulse-ring rounded-full border border-accent/10"
          style={{ animationDelay: "1s" }}
        />
        <div className="size-32 rounded-full bg-accent/10 blur-2xl" />
        <div className="absolute size-3 rounded-full bg-accent shadow-[var(--accent-glow)]" />
      </div>
      <h1 className="text-3xl font-extralight leading-snug tracking-tight">
        衝動に、
        <br />
        振り回されない。
      </h1>
      <p className="mt-6 text-sm font-light leading-relaxed text-muted-foreground">
        その90秒が、未来を変える。
      </p>
      <button
        onClick={onStart}
        className="mt-16 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground shadow-[var(--accent-glow)] transition-opacity hover:opacity-90"
      >
        さっそく始める
      </button>
      <p className="mt-6 text-[10px] tracking-widest text-muted-foreground">
        / 我慢ではなく、観察のアプリです
      </p>
    </div>
  );
}

function BreathSuccess({ onDone }: { onDone: () => void }) {
  const [sec, setSec] = useState(30);
  const [done, setDone] = useState(false);
  const startRef = useRef(Date.now());
  useEffect(() => {
    const i = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const rem = Math.max(0, 30 - elapsed);
      setSec(rem);
      if (rem <= 0) {
        clearInterval(i);
        setDone(true);
      }
    }, 100);
    return () => clearInterval(i);
  }, []);

  const t = ((30 - sec) % 10) / 10;
  const scale = 1 + Math.sin(t * Math.PI * 2) * 0.18;
  const label = t < 0.4 ? "吸って" : t < 0.5 ? "止めて" : "吐いて";

  if (done) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-8 flex size-16 items-center justify-center rounded-full border border-accent/40 shadow-[var(--accent-glow)]">
          <div className="size-2.5 rounded-full bg-accent" />
        </div>
        <p className="text-[10px] tracking-[0.3em] text-accent">最初の30秒、完了</p>
        <h2 className="mt-3 text-2xl font-extralight tracking-tight">
          もう、始まっています。
        </h2>
        <p className="mt-4 max-w-[26ch] text-sm font-light leading-relaxed text-muted-foreground">
          いま呼吸できた、それがあなたの最初の1回。
          次に衝動がきたら、同じことをするだけです。
        </p>
        <button
          onClick={onDone}
          className="mt-12 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground shadow-[var(--accent-glow)] transition-opacity hover:opacity-90"
        >
          ホームへ
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute size-48 rounded-full bg-accent/20 blur-2xl transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className="absolute size-36 rounded-full border border-accent/40 bg-accent/5 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="relative flex flex-col items-center">
          <span className="text-6xl font-extralight tabular-nums tracking-tighter">
            {Math.ceil(sec)}
          </span>
          <span className="mt-1 text-[10px] tracking-[0.3em] text-accent">
            {label}
          </span>
        </div>
      </div>
      <p className="mt-12 text-xs font-light text-muted-foreground">
        / 急がず、合わせなくていい
      </p>
      <button
        onClick={() => setDone(true)}
        className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        スキップ →
      </button>
    </div>
  );
}
