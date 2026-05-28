import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  evidence?: string;
}

const ENTRIES: Entry[] = [
  {
    id: "dopamine",
    category: "脳科学",
    title: "ドーパミンとは何か",
    excerpt: "「快楽」ではなく「予測」の神経伝達物質。",
    body: "ドーパミンは『気持ちよさ』そのものではなく、『次に何かいいことが起こる』という予測信号として放出されます。SNSの通知音、コンビニのドアの音、ポテチの袋の音 — これらは脳にドーパミンを先行放出させ、行動を駆り立てます。観察すべきは欲望そのものではなく、その『引き金』。引き金を可視化できれば、欲求の半分は終わったも同然です。",
    evidence: "Schultz W. (1998) Predictive reward signal of dopamine neurons. J Neurophysiol.",
  },
  {
    id: "serotonin",
    category: "脳科学",
    title: "セロトニン — 安心のホルモン",
    excerpt: "“食べたい”の正体は、“落ち着きたい”かもしれない。",
    body: "セロトニンは安心感や幸福感に関わる神経伝達物質。糖質を摂ると一時的にセロトニンが増えるため、ストレス時に甘いものが欲しくなります。つまり脳は『食べ物』ではなく『安心』を求めている。日光浴・軽い運動・人との会話・温かい飲み物でもセロトニンは増えます。",
    evidence: "Wurtman & Wurtman (1995) Brain serotonin, carbohydrate-craving. Obesity Research.",
  },
  {
    id: "noradrenaline",
    category: "脳科学",
    title: "ノルアドレナリンと衝動",
    excerpt: "“戦うか逃げるか”を起動する物質。",
    body: "ストレスや怒りで放出されるノルアドレナリンは、注意を狭め、即座の行動を促します。長時間続くと前頭前野の働きを下げ、衝動的な判断が増加します。深い呼吸（4秒吸って8秒吐く）は副交感神経を刺激し、ノルアドレナリンの過剰放出を物理的に抑えます。",
    evidence: "Arnsten AFT (2009) Stress signalling pathways that impair prefrontal cortex. Nat Rev Neurosci.",
  },
  {
    id: "prefrontal",
    category: "脳科学",
    title: "前頭前野 — “手動運転”の場所",
    excerpt: "ここが疲れると、脳は自動運転に戻る。",
    body: "前頭前野は計画・抑制・長期目標を司る、人間らしさの中心。しかし疲労・睡眠不足・低血糖で機能が急速に低下します（自我消耗）。この状態では衝動を抑えるのではなく、『環境を変える』『一度立ち止まる』ことが現実的な戦略です。意志ではなく仕組みで勝つ。",
    evidence: "Baumeister et al. (1998) Ego depletion: is the active self a limited resource? JPSP.",
  },
  {
    id: "amygdala",
    category: "脳科学",
    title: "扁桃体 — 感情の警報装置",
    excerpt: "“ラベルをつける”だけで、警報は静かになる。",
    body: "扁桃体は危険や強い感情に即反応する古い脳。怒り・不安・渇望はここから生まれます。fMRI研究で、感情に『これは怒りだ』『これは不安だ』と言語化（affect labeling）するだけで扁桃体の活動が下がり、前頭前野が活性化することが示されています。記録するだけで脳が変わる科学的根拠です。",
    evidence: "Lieberman et al. (2007) Putting feelings into words. Psychological Science.",
  },
  {
    id: "reward-system",
    category: "脳科学",
    title: "報酬系 — ハマる仕組み",
    excerpt: "中脳辺縁系ドーパミン経路の暴走。",
    body: "VTA→側坐核→前頭前野の経路が『報酬系』。アルコール、ニコチン、SNS、ポルノはすべてこの経路を直接刺激します。問題は『気持ちよくなる』ことではなく、『普段の楽しみで満足できなくなる』こと（耐性形成）。回復とは、報酬系の感度が戻ることです。",
    evidence: "Volkow et al. (2016) Neurobiologic advances from the brain disease model of addiction. NEJM.",
  },
  {
    id: "habit-loop",
    category: "習慣形成",
    title: "習慣ループ — トリガー・行動・報酬",
    excerpt: "全ての習慣は3要素でできている。",
    body: "MITの研究で、習慣は『きっかけ（cue）→ 行動（routine）→ 報酬（reward）』のループで脳の大脳基底核に刻まれることが示されました。悪習慣を消そうとせず、『同じきっかけ』『同じ報酬』を残したまま『行動だけ』を別のものに置き換えると、最小コストで変えられます。",
    evidence: "Graybiel AM (2008) Habits, rituals, and the evaluative brain. Annu Rev Neurosci.",
  },
  {
    id: "implementation-intention",
    category: "習慣形成",
    title: "もし〜なら、〜する（if-then プラン）",
    excerpt: "意志より、設計。",
    body: "『もしXが起きたら、Yをする』という形で前もって決めておくと、実行率が2〜3倍に上がるという研究があります（実行意図 / implementation intentions）。例:『もし夜10時を過ぎたら、白湯を飲んで歯を磨く』。衝動の瞬間に考えなくていい状態を、平常時に作っておく。",
    evidence: "Gollwitzer PM (1999) Implementation intentions: strong effects of simple plans. American Psychologist.",
  },
  {
    id: "small-wins",
    category: "行動経済学",
    title: "小さな成功体験の力",
    excerpt: "脳は『進んだ感覚』を最高の報酬と見なす。",
    body: "ハーバード大Amabileの研究では、人のモチベーションを最も高めるのは『小さな前進の実感』であることが示されました。完璧な日より、『今日も1回観察できた』を積み上げる方が、長期の行動変容には強い。失敗ゼロを目指さず、進捗が見える設計を選ぶ。",
    evidence: "Amabile & Kramer (2011) The Progress Principle. Harvard Business Review Press.",
  },
  {
    id: "loss-aversion",
    category: "行動経済学",
    title: "損失回避バイアス",
    excerpt: "人は得る喜びの約2倍、失う痛みを感じる。",
    body: "カーネマンとトベルスキーのプロスペクト理論。だから『痩せたら〜できる』より『今日のリズムを失わない』方が行動を支えやすい。連続記録（streak）を『失いたくない』と感じる心理は、依存ではなく、行動変容の燃料に使えます。",
    evidence: "Kahneman & Tversky (1979) Prospect Theory. Econometrica.",
  },
  {
    id: "cortisol",
    category: "ホルモン",
    title: "コルチゾールと夜の衝動",
    excerpt: "夕方〜夜、コルチゾールが下がり抑制も下がる。",
    body: "コルチゾールには日内リズムがあり、朝に高く夜に低くなります。低下する夕方〜深夜は注意・抑制も弱まる時間帯。同時に低血糖と疲労が重なるため、高カロリー食やSNSへの渇望が物理的に高まります。『夜の自分』と戦うのではなく、夜になる前に環境を整えるのが鍵。",
    evidence: "Adam EK et al. (2017) Diurnal cortisol slopes and mental and physical health outcomes. Psychoneuroendocrinology.",
  },
  {
    id: "sleep",
    category: "ホルモン",
    title: "睡眠不足と食欲",
    excerpt: "6時間未満で、グレリンが急上昇。",
    body: "睡眠不足は食欲増進ホルモン『グレリン』を増やし、満腹ホルモン『レプチン』を減らします。結果、翌日の摂取カロリーは平均300〜500kcal増えるという報告。さらに高カロリー食を選ぶ確率も上がる。ダイエットの最大の敵は、間食ではなく睡眠不足かもしれません。",
    evidence: "Spiegel et al. (2004) Sleep curtailment is associated with leptin/ghrelin alterations. Ann Intern Med.",
  },
  {
    id: "blood-sugar",
    category: "ホルモン",
    title: "血糖値スパイクと衝動",
    excerpt: "急上昇のあとの急降下が、次の渇望を呼ぶ。",
    body: "精製糖質を空腹時に摂ると血糖値が急上昇し、インスリンの過剰反応で急降下。この谷で再び強い空腹と集中力低下が起こります（反応性低血糖）。たんぱく質・食物繊維を先に摂る、朝食を抜かない、夕方の間食を質の良いものにする — これだけで夜の衝動が変わります。",
    evidence: "Wyatt P et al. (2021) Postprandial glycaemic dips predict appetite. Nature Metabolism.",
  },
  {
    id: "stress-eating",
    category: "行動",
    title: "ストレス食いの正体",
    excerpt: "本当に欲しいのは、食べ物ではなく安心。",
    body: "ストレス時にはコルチゾールが上がり、糖質・脂質への嗜好が高まります。これは生理的な反応であって、意志の弱さではありません。『今、お腹が空いている？それとも、安心したい？』と一度だけ自分に問うこと。多くの場合、答えは後者です。",
    evidence: "Adam & Epel (2007) Stress, eating and the reward system. Physiol Behav.",
  },
  {
    id: "latenight",
    category: "行動",
    title: "なぜ深夜に食べたくなるのか",
    excerpt: "前頭前野が疲労し、抑制機能が落ちる時間帯。",
    body: "1日の終わりには意思決定リソースが枯渇し、前頭前野の抑制機能が低下します。同時にコルチゾールの日内変動と血糖値の谷が重なり、高カロリー食への欲求が物理的に高まります。『夜の自分』と戦うのではなく、『夜になる前に環境を整える』ことが鍵。冷蔵庫の中身、机の上、スマホの位置 — 夜10時の自分が決断しなくていい設計を、昼の自分が作る。",
    evidence: "Hofmann et al. (2012) Everyday temptations: experience sampling study. JPSP.",
  },
  {
    id: "sns",
    category: "行動",
    title: "SNS依存の仕組み",
    excerpt: "可変報酬スケジュール — 最強の中毒設計。",
    body: "スロットマシンと同じ『いつ報酬が来るかわからない』設計（可変比率強化）により、脳はスクロールを止められなくなります。これは意志の弱さではなく、設計に対する正常な反応。アプリ側は数千人のエンジニアが『止めさせない』ために最適化しています。負けて当然の戦い。だからこそ、戦わない設計（通知オフ・グレースケール・物理的距離）が効きます。",
    evidence: "Skinner BF (1953) Science and Human Behavior — variable ratio reinforcement.",
  },
  {
    id: "urge-surfing",
    category: "技法",
    title: "衝動サーフィンの科学",
    excerpt: "波として眺めると、ピークは数分で去る。",
    body: "心理学者アラン・マーラットが依存症治療のために開発した技法。衝動を抑えようとせず、『波が来た』『上がっている』『ピークだ』『引いていく』と実況のように観察します。多くの渇望のピークは3〜15分以内に去ることが研究で示されています。抑え込まないからこそ、反動も起きません。",
    evidence: "Bowen & Marlatt (2009) Surfing the urge. Psychology of Addictive Behaviors.",
  },
  {
    id: "self-compassion",
    category: "技法",
    title: "自己批判より、自己慈悲",
    excerpt: "“次の1回”を整える方が、行動が変わる。",
    body: "テキサス大Neffの研究では、自分を責めるよりも『誰にでもあること』と扱える人ほど、長期的に行動変容が続くことが示されています。自己嫌悪は短期的にはやる気を出すように感じても、結局は『どうせ自分は…』を強化し、再発を早めます。記録できた時点で前進、です。",
    evidence: "Neff & Germer (2013) Self-compassion and resilience. J Clin Psychol.",
  },
];

const CATEGORIES = ["すべて", "脳科学", "ホルモン", "習慣形成", "行動経済学", "行動", "技法"] as const;
type Category = (typeof CATEGORIES)[number];

function Codex() {
  const [open, setOpen] = useState<string | null>(null);
  const [cat, setCat] = useState<Category>("すべて");

  const filtered = useMemo(
    () => (cat === "すべて" ? ENTRIES : ENTRIES.filter((e) => e.category === cat)),
    [cat],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">脳の図鑑</p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">欲望図鑑</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            自分を責めるための知識ではなく、脳の仕組みを理解するための図鑑です。
          </p>
        </header>

        <div className="mt-6 -mx-6 overflow-x-auto px-6">
          <div className="flex gap-2">
            {CATEGORIES.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors " +
                    (active
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-border bg-white/[0.03] text-muted-foreground hover:text-foreground")
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map((e, i) => {
            const isOpen = open === e.id;
            return (
              <div
                key={e.id}
                className="animate-fade-in-up rounded-2xl border border-border bg-white/5 transition-colors hover:border-white/15"
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : e.id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/30 font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] tracking-widest text-muted-foreground">{e.category}</p>
                    <h3 className="mt-1 text-base font-medium">{e.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {e.excerpt}
                    </p>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 pb-5 pt-4">
                    <p className="text-sm font-light leading-relaxed text-foreground/90">{e.body}</p>
                    {e.evidence && (
                      <p className="mt-4 rounded-xl border border-border/60 bg-white/[0.02] p-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                        出典: {e.evidence}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[11px] leading-relaxed text-muted-foreground/80">
          ※ 本図鑑は研究結果に基づく一般的な情報であり、医学的助言ではありません。
        </p>
      </div>
      <BottomNav />
    </div>
  );
}