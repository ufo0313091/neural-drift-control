import type { UrgeType, UrgeLog, Profile } from "./storage";
import { TRIGGER_LABELS, URGE_LABELS } from "./storage";

/**
 * 欲求タイプごとのプロトコル。
 * 精神論ではなく、行動科学・神経科学の知見を優先する。
 */
export interface UrgeProtocol {
  /** ピーク時にまず読むコピー */
  calming: string;
  /** 観察中（30秒以降）に出す“なぜ今これが効くか”の科学メモ */
  science: string;
  /** エビデンス寄りの代替行動（短く、すぐ実行可） */
  alternatives: string[];
  /** やりがちだが避けたい事 */
  avoid: string[];
  /** タイプ別の通知/環境調整のヒント */
  environment: string[];
}

export const URGE_PROTOCOLS: Record<UrgeType, UrgeProtocol> = {
  food: {
    calming:
      "空腹ではなく、脳の報酬系の反応かもしれません。90秒だけ、口に入れる前に観察します。",
    science:
      "血糖値が急に下がると、脳は“糖”を強く求めます。水とタンパク質で30〜40分待つと、衝動の多くは静まります。",
    alternatives: [
      "常温の水を一杯、ゆっくり飲む",
      "歯を磨いて口の中の感覚を変える",
      "タンパク質を一口（卵・チーズ・無糖ヨーグルト）",
      "白湯または無糖の温かい飲み物",
      "席を立って3分だけ場所を変える",
    ],
    avoid: ["自分を責める", "極端な絶食", "“もう今日はダメだ”という全否定"],
    environment: [
      "目につく場所にお菓子を置かない",
      "深夜の買い物アプリの通知をオフ",
      "夕食でタンパク質を意識的に増やす",
    ],
  },
  snack: {
    calming: "間食の衝動は、味より“刺激”を求めていることが多いです。",
    science:
      "口腔の感覚刺激は、報酬系の興奮を一時的に上書きします。歯磨き・冷水・ガムが有効です。",
    alternatives: [
      "歯を磨く",
      "冷たい水で口をすすぐ",
      "ガムを一粒",
      "炭酸水をグラスに注ぐ",
    ],
    avoid: ["“一口だけ”と自分に交渉する", "ながら食べ"],
    environment: ["手の届く場所からお菓子を遠ざける"],
  },
  sns: {
    calming:
      "SNSを開きたい衝動は、孤独・退屈・不安への“とりあえずの応答”であることが多いです。",
    science:
      "通知と無限スクロールは、可変比率強化スケジュール（ギャンブルと同じ報酬設計）です。意志ではなく、設計に負けています。",
    alternatives: [
      "スマホを画面ごと伏せて30秒",
      "通知を1時間だけオフ",
      "アプリをホーム画面から外す",
      "外の空気を10秒だけ吸う",
      "“今、何を確認したかった？”と一言メモ",
    ],
    avoid: ["“5分だけ”で開く", "スクロール中に自己嫌悪を上塗りする"],
    environment: [
      "ホーム画面1ページ目からSNSを外す",
      "夜間のスクリーンタイム制限を設定",
      "通知バッジをオフ",
    ],
  },
  shopping: {
    calming: "“買う”ことではなく、“ポチった瞬間のドーパミン”が欲しいだけかもしれません。",
    science:
      "購入欲はピークから24時間で大幅に減衰します（決定の先送りは“我慢”ではなく“判断の保留”です）。",
    alternatives: [
      "カートに入れて、24時間置く",
      "値段を自分の時給で割ってみる",
      "同じ用途の物を3つ思い出す",
      "“これがなかった去年”を1分思い出す",
    ],
    avoid: ["“今だけ”の煽り文句に応える", "深夜に決済する"],
    environment: ["ワンクリック購入をオフ", "クレカ情報を保存しない"],
  },
  latenight: {
    calming: "夜更かしの多くは、“1日を終わらせたくない気持ち”からきます。",
    science:
      "強い光（特にブルーライト）はメラトニン分泌を抑制します。照明を1段落とすだけで、入眠スイッチが入ります。",
    alternatives: [
      "部屋の照明を1段落とす",
      "スマホを別の部屋に置く",
      "歯を磨いてベッドに移動するだけ",
      "4秒吸って8秒吐く呼吸を5回",
      "明日の自分に一言メモを書く",
    ],
    avoid: ["ベッドでスマホを見る", "“あと1本だけ”の動画"],
    environment: [
      "寝る1時間前から間接照明に切替",
      "充電器をベッドから遠ざける",
      "おやすみモードを自動化",
    ],
  },
  porn: {
    calming: "脳は刺激を求めているだけで、あなた自身ではありません。",
    science:
      "強い視覚報酬は耐性を生み、感度を鈍らせます。場所を変える・身体を動かすことで、回路を分断できます。",
    alternatives: [
      "立ち上がって部屋を出る",
      "冷たい水で顔を洗う",
      "20回スクワット",
      "外の空気を吸う",
    ],
    avoid: ["布団の中で粘る", "自己嫌悪のループに入る"],
    environment: ["ブラウザ履歴・ブックマークを整理", "ベッドにスマホを持ち込まない"],
  },
  smoke: {
    calming: "ニコチンの欲求のピークは、約3〜5分で減衰します。",
    science:
      "喫煙欲はホルモン的にも数分単位で減ります。“今の波だけ”やり過ごせば、確実に楽になります。",
    alternatives: [
      "水を一口、深呼吸を5回",
      "外の空気を10秒",
      "ガムを一粒",
      "歯を磨く",
    ],
    avoid: ["“1本だけ”ルール", "灰皿・ライターを手元に置く"],
    environment: ["タバコを手の届かない場所に", "喫煙所のルートを物理的に変える"],
  },
  alcohol: {
    calming: "“飲みたい”ではなく、“切替えたい”気持ちかもしれません。",
    science:
      "アルコールは入眠を浅くし、翌日の不安感を増やします。代替の儀式（炭酸・湯気）でも切替えは可能です。",
    alternatives: [
      "炭酸水をワイングラスに注ぐ",
      "白湯をゆっくり飲む",
      "歯を磨く",
      "シャワーで切替える",
    ],
    avoid: ["“今日くらい”の言い訳", "空腹で飲む"],
    environment: ["買い置きを減らす", "家に強い酒を置かない"],
  },
  anger: {
    calming: "怒りのピークは、約6秒で生理的に下がり始めます。",
    science:
      "扁桃体の興奮は、ゆっくりした呼気で鎮まります。吐く息を倍長くすると副交感神経が優位になります。",
    alternatives: [
      "6秒、ゆっくり息を吐ききる",
      "その場を物理的に離れる",
      "肩を一度大きく回す",
      "冷たい水を一口",
    ],
    avoid: ["即レス・即発言", "“正しさ”で押し切ろうとする"],
    environment: ["怒りやすい時間帯に重要な決定をしない"],
  },
  negative: {
    calming: "それは“事実”ではなく、脳が出した“解釈”の1つです。",
    science:
      "ネガティブ思考は、事実と解釈を紙に書き分けるだけで、感情強度が約30%下がるという報告があります（認知再評価）。",
    alternatives: [
      "頭の中の言葉を、そのまま紙に書き出す",
      "「事実」と「解釈」を2列に分ける",
      "5つ、今見えているものを声に出す（グラウンディング）",
      "自分にかける言葉を、友人にかけるなら？と置き換える",
    ],
    avoid: ["“前向きになれ”と自分を叱る", "原因を1つに決めつける"],
    environment: ["睡眠を最優先にする日を週1つ作る"],
  },
  emotion: {
    calming: "感情に名前をつけるだけで、扁桃体の活動は静まります（affect labeling）。",
    science: "感情のラベリングは、前頭前野を活性化し扁桃体を抑制する事が示されています。",
    alternatives: [
      "今の気持ちに、一言だけ名前をつける",
      "胸に手を当てて10秒",
      "息を6秒、吐ききる",
      "“今日はそういう日”と認める",
    ],
    avoid: ["感情を“消そう”とする", "原因探しに溺れる"],
    environment: ["疲れた日は予定を1つ減らす"],
  },
  other: {
    calming: "名前のつかない衝動も、観察できた時点で半分は弱まっています。",
    science:
      "衝動は平均90秒で生理的ピークが過ぎます（urge surfing / Marlatt）。",
    alternatives: ["水を一杯、ゆっくり飲む", "深呼吸を5回", "1分だけ場所を変える"],
    avoid: ["“いつもの自分”と決めつける"],
    environment: ["記録を続けて、パターンを可視化する"],
  },
};

/** ゴール文字列 → UrgeType の推測（オンボーディング用） */
export function guessUrgeFromGoal(goal: string): UrgeType {
  const g = goal.toLowerCase();
  if (/暴食|食べ|ダイエット|過食/.test(goal)) return "food";
  if (/間食|お菓子|スナック/.test(goal)) return "snack";
  if (/sns|スマホ|スクロール|インスタ|tiktok|twitter|x/.test(g)) return "sns";
  if (/買い物|衝動買い|浪費/.test(goal)) return "shopping";
  if (/夜更|夜ふ|寝|睡眠|早寝/.test(goal)) return "latenight";
  if (/ポルノ|アダルト|自慰/.test(goal)) return "porn";
  if (/タバコ|喫煙|禁煙/.test(goal)) return "smoke";
  if (/酒|飲酒|アルコール|禁酒/.test(goal)) return "alcohol";
  if (/怒り|キレ|イライラ/.test(goal)) return "anger";
  if (/ネガティブ|自己嫌悪|落ち込み/.test(goal)) return "negative";
  if (/感情|気分|波/.test(goal)) return "emotion";
  return "other";
}

/**
 * ログを元に、その人専用のインサイトを1〜2行で生成。
 * “理解されている感”を出すための短い言葉。
 */
export function buildPersonalInsight(
  logs: UrgeLog[],
  _profile: Profile | null,
): string | null {
  if (logs.length < 3) return null;
  const recent = logs.slice(0, 30);

  // 時間帯
  const lateNight = recent.filter((l) => {
    const h = new Date(l.ts).getHours();
    return h >= 22 || h < 4;
  }).length;
  const lateRatio = lateNight / recent.length;

  // 引き金×衝動
  const pair = new Map<string, number>();
  for (const l of recent) {
    if (!l.trigger) continue;
    const k = `${l.trigger}|${l.type}`;
    pair.set(k, (pair.get(k) ?? 0) + 1);
  }
  const top = [...pair.entries()].sort((a, b) => b[1] - a[1])[0];

  if (lateRatio > 0.5) {
    const u = top
      ? URGE_LABELS[top[0].split("|")[1] as UrgeType]
      : "衝動";
    return `最近は22時以降に「${u}」が増えています。睡眠不足が影響しているかもしれません。`;
  }

  if (top && top[1] >= 2) {
    const [trgKey, typKey] = top[0].split("|");
    const t = TRIGGER_LABELS[trgKey as keyof typeof TRIGGER_LABELS];
    const u = URGE_LABELS[typKey as UrgeType];
    return `「${t}」を感じたとき、「${u}」の衝動が起きやすい傾向です。`;
  }

  return null;
}

/** 観察直後のフィードバック（タイプ別の科学メモを混ぜる） */
export function protocolScience(type: UrgeType): string {
  return URGE_PROTOCOLS[type].science;
}