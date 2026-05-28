import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useProfile, type Profile } from "@/lib/storage";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const GOALS = [
  "夜の暴食を減らしたい",
  "SNSを見る時間を減らしたい",
  "禁煙したい",
  "夜更かしを終わらせたい",
  "集中できる自分に戻りたい",
  "お酒との距離を整えたい",
  "衝動買いを止めたい",
  "ポルノ依存から抜け出したい",
];

const VOICES: { id: Profile["voice"]; label: string; desc: string }[] = [
  { id: "kind", label: "優しい", desc: "そっと寄り添う" },
  { id: "calm", label: "冷静", desc: "客観的な視点" },
  { id: "coach", label: "コーチ風", desc: "前向きに後押し" },
  { id: "scientist", label: "科学者風", desc: "脳の仕組みで説明" },
  { id: "future", label: "未来の自分", desc: "ひとつ先のあなた" },
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
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [reason, setReason] = useState("");
  const [voice, setVoice] = useState<Profile["voice"]>("calm");

  const finalGoal = customGoal.trim() || goal;

  const finish = () => {
    save({
      goal: finalGoal,
      reason: reason.trim(),
      voice,
      createdAt: Date.now(),
    });
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pt-12 pb-10">
        <header className="mb-10 animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">
            はじめに / {String(step + 1).padStart(2, "0")} / 03
          </p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">
            {step === 0 && "目標を設定"}
            {step === 1 && "なぜ、それを?"}
            {step === 2 && "通知の人格を選択"}
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            {step === 0 && "脳が向かう方向を、ひとつ。"}
            {step === 1 && "“目標”ではなく、“人生の理由”を書いてください。衝動の瞬間、この言葉があなたを引き戻します。"}
            {step === 2 && "あなたに語りかける声を選んでください。"}
          </p>
        </header>

        <main className="flex-1 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          {step === 0 && (
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

          {step === 1 && (
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

          {step === 2 && (
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
        </main>

        <footer className="mt-10 flex items-center justify-between gap-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground disabled:opacity-30"
          >
            ← Back
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={(step === 0 && !finalGoal) || (step === 1 && !reason.trim())}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={finish}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-[var(--accent-glow)] transition-opacity hover:opacity-90"
            >
              起動する
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}