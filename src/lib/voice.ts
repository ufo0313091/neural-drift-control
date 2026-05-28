import type { Profile, UrgeType } from "./storage";
import { URGE_PROTOCOLS } from "./protocols";

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
  // タイプ別エビデンスベース対策をプロトコルから採用
  const pool = URGE_PROTOCOLS[type]?.alternatives?.length
    ? URGE_PROTOCOLS[type].alternatives
    : fallback;
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