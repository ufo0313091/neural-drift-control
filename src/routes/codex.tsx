import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/codex")({
  component: Codex,
});

interface Entry {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
}

const ENTRIES: Entry[] = [
  {
    id: "dopamine",
    category: "Neuroscience",
    title: "ドーパミンとは何か",
    excerpt: "「報酬」ではなく「予測」の神経伝達物質。",
    body: "ドーパミンは快楽そのものではなく、「次に何かいいことが起こる」という予測信号として放出されます。SNSの通知音、ポテチの袋の音 — これらの刺激は脳にドーパミンを先行放出させ、行動を駆り立てます。観察すべきは、欲望そのものではなく、その引き金です。",
  },
  {
    id: "latenight",
    category: "Behavior",
    title: "なぜ深夜に食べたくなるのか",
    excerpt: "前頭前野が疲労すると、抑制が外れる。",
    body: "1日の終わりには意思決定リソース（自我消耗）が枯渇し、前頭前野の抑制機能が低下します。同時に、コルチゾールの日内変動と血糖値の谷が重なり、高カロリー食への欲求が物理的に高まります。「夜の自分」と戦うのではなく、「夜になる前に環境を整える」ことが鍵です。",
  },
  {
    id: "sns",
    category: "Behavior",
    title: "SNS依存の仕組み",
    excerpt: "可変報酬スケジュールという最強の中毒設計。",
    body: "スロットマシンと同じ「いつ報酬が来るかわからない」設計（可変比率強化）により、脳はスクロールを止められなくなります。これは意志の弱さではなく、設計に対する正常な反応です。アプリを責める必要はないが、設計を理解することはできます。",
  },
  {
    id: "sleep",
    category: "Physiology",
    title: "睡眠不足と食欲の関係",
    excerpt: "睡眠が6時間を切ると、グレリンが急上昇。",
    body: "睡眠不足は食欲増進ホルモン「グレリン」を増やし、満腹ホルモン「レプチン」を減らします。結果、翌日の摂取カロリーは平均300-500kcal増えるという研究があります。ダイエットの最大の敵は、間食ではなく睡眠不足かもしれません。",
  },
  {
    id: "urge-surfing",
    category: "Technique",
    title: "衝動サーフィンの科学",
    excerpt: "波として観察すると、ピークは数分で去る。",
    body: "心理学者アラン・マーラットが開発した技法。衝動を抑えようとせず、「波が来た」「上がっている」「ピークだ」「引いていく」と実況のように観察します。fMRI研究では、この観察行為が扁桃体の活動を下げ、前頭前野を活性化することが示されています。",
  },
  {
    id: "stress-eating",
    category: "Behavior",
    title: "ストレス食いの正体",
    excerpt: "本当は食べ物ではなく、安心を求めている。",
    body: "ストレス時の食欲は、糖質が一時的にセロトニンを増やし安心感をもたらすため。つまり「食べたい」のではなく「落ち着きたい」のです。深呼吸、温かい飲み物、人との会話など、別の方法でセロトニンを満たすことができます。",
  },
];

function Codex() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Codex Cerebri
          </p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">欲望図鑑</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            脳の仕組みを知ることが、最強の武器になる。
          </p>
        </header>

        <div className="mt-8 space-y-3">
          {ENTRIES.map((e, i) => {
            const isOpen = open === e.id;
            return (
              <div
                key={e.id}
                className="animate-fade-in-up rounded-2xl border border-border bg-white/5 transition-colors hover:border-white/15"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : e.id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/30 font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {e.category}
                    </p>
                    <h3 className="mt-1 text-base font-medium">{e.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {e.excerpt}
                    </p>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 pb-5 pt-4 text-sm font-light leading-relaxed text-foreground/90">
                    {e.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}