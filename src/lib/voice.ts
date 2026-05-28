import type { Profile, UrgeType } from "./storage";

type Voice = Profile["voice"];

/** Stage A: 0–30s — まず落ち着かせる */
export function voiceCalmingLines(voice: Voice): string[] {
  switch (voice) {
    case "kind":
      return [
        "大丈夫。今は波が強いだけです。",
        "あなたの意志の弱さではありません。脳の反応です。",
        "まず90秒だけ、一緒に眺めてみましょう。",
      ];
    case "calm":
      return [
        "現在、衝動はピーク付近です。",
        "これは報酬系の自動反応で、必ず減衰します。",
        "90秒の観察を開始します。判断はあとで構いません。",
      ];
    case "coach":
      return [
        "今すぐ決めなくていい。まず90秒。",
        "意志ではなく、姿勢を立て直そう。",
        "波に飲まれない。まず観る。",
      ];
    case "future":
      return [
        "ここで止まれたあなたを、私はちゃんと覚えています。",
        "あの90秒があったから、私は今ここにいる。",
        "今は何もしなくていい。ただ呼吸して。",
      ];
    case "scientist":
      return [
        "これは前頭前野ではなく、報酬系・扁桃体の反応です。",
        "ドーパミンのスパイクは数十秒で減衰します。",
        "意志の問題ではなく、刺激と環境の問題です。",
      ];
  }
}

/** Stage B: 30–60s — 未来設計を呼び戻す */
export function voiceVisionPrefix(voice: Voice): string {
  switch (voice) {
    case "kind":
      return "あなたが描いた未来を、もう一度。";
    case "calm":
      return "あなた自身が定義した未来像を参照します。";
    case "coach":
      return "目を逸らすな。お前が決めた未来だ。";
    case "future":
      return "私（未来のあなた）から、ひとつだけ伝えさせて。";
    case "scientist":
      return "長期報酬の再認識フェーズです。";
  }
}

/** Stage C: 60–90s — 次の一手・伴走の言葉 */
export function voiceClosingLine(voice: Voice): string {
  switch (voice) {
    case "kind":
      return "ここまで観察できた自分を、まず認めてあげて。";
    case "calm":
      return "波は減衰局面に入りました。次の一手だけ選びましょう。";
    case "coach":
      return "ここまで来た。次の小さな1手で決める。";
    case "future":
      return "未来のあなたは、今の90秒をちゃんと覚えています。";
    case "scientist":
      return "報酬系の反応は弱まりました。代替行動で上書きしましょう。";
  }
}

/** “おまかせ対策” — 衝動タイプから1つだけ提案する */
export function suggestOneAction(
  type: UrgeType,
  fallback: string[] = [],
): string {
  const map: Record<UrgeType, string[]> = {
    food: [
      "水を一杯、ゆっくり飲む",
      "歯を磨いてみる",
      "白湯を入れる",
      "プロテインを一口だけ",
    ],
    snack: [
      "水を一杯、ゆっくり飲む",
      "歯を磨いてみる",
      "ガムを一粒だけ",
    ],
    sns: [
      "スマホを画面ごと伏せる",
      "通知を1時間だけ切る",
      "1分だけ目を閉じる",
    ],
    shopping: [
      "カートを閉じて、24時間置く",
      "値段を時給で割ってみる",
      "今ある物を3つ思い出す",
    ],
    latenight: [
      "照明を1段落とす",
      "画面を伏せて、明日の自分に一言書く",
      "歯を磨いて、ベッドに移動するだけ",
    ],
    porn: [
      "立ち上がって場所を変える",
      "冷たい水で顔を洗う",
      "20回スクワット",
    ],
    smoke: [
      "水を一口、深呼吸を5回",
      "外の空気を10秒",
      "ガムを一粒だけ",
    ],
    alcohol: [
      "炭酸水をグラスに注ぐ",
      "白湯をゆっくり飲む",
      "歯を磨いてみる",
    ],
    anger: [
      "6秒、ゆっくり息を吐く",
      "その場を離れて窓の外を見る",
      "肩を一度大きく回す",
    ],
    negative: [
      "頭の中の言葉を、紙に書き出す",
      "事実と解釈を分けてみる",
      "5つ、今見えているものを声に出す",
    ],
    emotion: [
      "今の気持ちに、一言だけ名前をつける",
      "息を6秒、吐ききる",
      "胸に手を当てて10秒",
    ],
    other: [
      "水を一杯、ゆっくり飲む",
      "深呼吸を5回",
      "1分だけ場所を変える",
    ],
  };
  const pool = (map[type] && map[type].length ? map[type] : fallback);
  if (!pool.length) return "深呼吸を、5回だけ。";
  return pool[Math.floor(Math.random() * pool.length)];
}

/** 終了後フィードバック生成 */
export function buildFeedback(args: {
  waitedSec: number;
  prevWaitedSec?: number;
  hour: number;
  type: UrgeType;
  voice: Voice;
  nextAction?: string;
}): string[] {
  const out: string[] = [];
  out.push(`今回は${Math.round(args.waitedSec)}秒、観察できました。`);
  if (args.prevWaitedSec !== undefined) {
    const diff = Math.round(args.waitedSec - args.prevWaitedSec);
    if (diff > 5) out.push(`前回より${diff}秒長く観察できました。`);
    else if (diff < -5) out.push("前回より短くなりましたが、記録できたこと自体が前進です。");
    else out.push("前回と同じくらい、安定して観察できました。");
  }
  if (args.hour >= 22 || args.hour < 4) {
    out.push("深夜帯は前頭前野が弱まりやすい時間です。睡眠が一番効きます。");
  } else if (args.hour >= 14 && args.hour < 17) {
    out.push("午後の血糖変動による衝動の可能性があります。");
  }
  if (args.nextAction) {
    out.push(`次は「${args.nextAction}」を試してみましょう。`);
  }
  return out;
}