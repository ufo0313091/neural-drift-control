import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useProfile } from "@/lib/storage";

export const Route = createFileRoute("/future")({
  component: FuturePage,
});

const DEFAULT_ALTS = ["水を一杯飲む", "外の空気を吸う", "深呼吸を5回"];

function FuturePage() {
  const navigate = useNavigate();
  const { profile, ready, patch } = useProfile();
  const [vision, setVision] = useState("");
  const [antiVision, setAntiVision] = useState("");
  const [alts, setAlts] = useState<string[]>(DEFAULT_ALTS);
  const [futureSelfDescription, setFSD] = useState("");
  const [futureSelfWords, setFSW] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!profile) {
      navigate({ to: "/onboarding", replace: true });
      return;
    }
    setVision(profile.vision ?? "");
    setAntiVision(profile.antiVision ?? "");
    setAlts(profile.altActions?.length ? profile.altActions : DEFAULT_ALTS);
    setFSD(profile.futureSelfDescription ?? "");
    setFSW(profile.futureSelfWords ?? "");
  }, [ready, profile, navigate]);

  const updateAlt = (i: number, v: string) => {
    setAlts((arr) => arr.map((a, idx) => (idx === i ? v : a)));
  };
  const addAlt = () => setAlts((a) => [...a, ""]);
  const removeAlt = (i: number) => setAlts((a) => a.filter((_, idx) => idx !== i));

  const save = () => {
    patch({
      vision: vision.trim(),
      antiVision: antiVision.trim(),
      altActions: alts.map((a) => a.trim()).filter(Boolean),
      futureSelfDescription: futureSelfDescription.trim(),
      futureSelfWords: futureSelfWords.trim(),
    });
    navigate({ to: "/" });
  };

  if (!ready || !profile) return <div className="min-h-screen bg-background" />;
  const isFutureVoice = profile.voice === "future";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">未来設計</p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">
            未来の自分を、ここで描く。
          </h1>
          <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
            衝動の瞬間、これらの言葉が静かにあなたを引き戻します。完璧じゃなくていい、短くても構いません。
          </p>
        </header>

        <section className="mt-8 space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <Block
            badge="01"
            title="叶ったら、どんな自分?"
            hint="例：身体が軽い。集中できる。自分のことが少し好き。"
          >
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              rows={4}
              placeholder="新しい習慣が身についた未来の自分を、具体的に書いてみてください。"
              className="w-full resize-none rounded-2xl border border-border bg-white/5 p-4 text-sm font-light leading-relaxed placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
            />
          </Block>

          <Block
            badge="02"
            title="逆に、続けたままだったら?"
            hint="責める言葉ではなく、未来を冷静に見つめる文章で。"
          >
            <textarea
              value={antiVision}
              onChange={(e) => setAntiVision(e.target.value)}
              rows={4}
              placeholder="例：朝が辛い。自己嫌悪が増える。やりたかったことに時間が残らない。"
              className="w-full resize-none rounded-2xl border border-border bg-white/5 p-4 text-sm font-light leading-relaxed placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
            />
          </Block>

          <Block
            badge="03"
            title="衝動に負けそうな時、何を試す?"
            hint="観察モード中と、「実行した」のあとに、ここから表示されます。"
          >
            <div className="space-y-2">
              {alts.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={a}
                    onChange={(e) => updateAlt(i, e.target.value)}
                    placeholder="例：水を一杯飲む"
                    className="flex-1 rounded-2xl border border-border bg-white/5 p-3 text-sm font-light placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
                  />
                  {alts.length > 1 && (
                    <button
                      onClick={() => removeAlt(i)}
                      className="size-9 rounded-full border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addAlt}
                className="w-full rounded-2xl border border-dashed border-border/60 bg-white/[0.02] p-3 text-xs text-muted-foreground hover:border-accent/40 hover:text-foreground"
              >
                + 追加
              </button>
            </div>
          </Block>

          {isFutureVoice && (
            <Block
              badge="04"
              title="未来の自分は、どんな人?"
              hint="通知メッセージは、ここで設定した人物像と言葉から生成されます。"
            >
              <textarea
                value={futureSelfDescription}
                onChange={(e) => setFSD(e.target.value)}
                rows={3}
                placeholder="例：3年後の自分。穏やかで、自分のリズムを大切にしている。"
                className="mb-3 w-full resize-none rounded-2xl border border-border bg-white/5 p-4 text-sm font-light leading-relaxed placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
              />
              <textarea
                value={futureSelfWords}
                onChange={(e) => setFSW(e.target.value)}
                rows={3}
                placeholder="未来の自分が、今のあなたに語りかける言葉を書いてください。"
                className="w-full resize-none rounded-2xl border border-border bg-white/5 p-4 text-sm font-light leading-relaxed placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
              />
            </Block>
          )}
        </section>

        <button
          onClick={save}
          className="mt-10 w-full rounded-full bg-accent py-4 text-base font-medium text-accent-foreground shadow-[var(--accent-glow)] transition-opacity hover:opacity-90"
        >
          保存する
        </button>
      </div>
      <BottomNav />
    </div>
  );
}

function Block({
  badge,
  title,
  hint,
  children,
}: {
  badge: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/30 font-mono text-[10px] text-accent">
          {badge}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-medium">{title}</h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
