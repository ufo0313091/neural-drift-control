import type { Profile, UrgeType } from "./storage";

type Voice = Profile["voice"];

const CALMING_LINES: Record<Voice, string[][]> = {
  kind: [
    ["今がいちばんきつい時間。あと少しで楽になる。","何もしなくていい。ただ呼吸して。","波はかならず引く。それを確かめるだけでいい。"],
    ["ここにいるだけで十分。逃げなくていい。","衝動を感じている自分は、弱くない。気づいている証拠。","少しだけ、ここにいてみよう。"],
    ["残りわずか。あなたはここにいる。","今この瞬間、選んでいる。それだけでいい。","もう少しだけ、一緒にいる。"],
  ],
  calm: [
    ["今がいちばんきつい時間。あと少しで楽になる。","何もしなくていい。ただ呼吸して。","波はかならず引く。それを確かめるだけでいい。"],
    ["感情は一時的な化学反応。90秒で変化が始まる。","今の状態を観察する。評価しなくていい。","衝動のピークは過ぎていく。データとして確認するだけでいい。"],
    ["ここまで来た。あと少しで変化のポイント。","脳のパターンを変えている瞬間。","今日の記録が、変化の証拠になる。"],
  ],
  coach: [
    ["今がいちばんきつい時間。あと少しで楽になる。","この感覚、乗り越えた回数だけ次が楽になる。","ここで止まれると、未来が変わる。"],
    ["あと半分。ここからが本番。","今の自分を誇っていい。止まることを選んでいる。","乗り越えるたびに、強くなっている。"],
    ["あと少し。最後まで行こう。","止まれた瞬間が、あなたの新しい記録になる。","できる。やれる。もうすぐ。"],
  ],
  scientist: [
    ["ドーパミンの波が来ている。90秒で落ち着き始める。","脳の報酬回路が活性化中。観察するだけでいい。","この反応は生理的なもの。意志力ではなく、時間が解決する。"],
    ["前頭前野が回復してきた。理性的な判断ができる状態に近づいている。","神経可塑性が働いている。今の選択が脳の配線を変える。","ストレスホルモンのピークが過ぎた。落ち着きが戻ってきている。"],
    ["90秒の神経科学的根拠が証明されている。もうすぐ完了。","新しい神経回路が形成されつつある。","今回の我慢が、次回の閾値を下げる。"],
  ],
  future: [
    ["未来の自分がここを見ている。止まれているのを知っている。","今の選択が、なりたい自分への一歩。","ここを越えた先に、あなたが目指している自分がいる。"],
    ["未来の自分は今、あなたを応援している。","この瞬間を選んでいることを、未来の自分は覚えている。","なりたい自分は、ここを越えた先にいる。"],
    ["あと少し。未来の自分が待っている。","今日の選択が、未来の自分を作る。","乗り越えた先の自分を、想像してみて。"],
  ],
};

const VISION_PREFIXES: Record<Voice, string> = {
  kind: "あなたが大切にしているもの、思い出して。",
  calm: "目標を確認する時間。",
  coach: "なぜ変わりたいか。それを今、思い出そう。",
  scientist: "目標は行動の指針。今がその判断ポイント。",
  future: "未来の自分から、今のあなたへ。",
};

const CLOSING_LINES: Record<Voice, string> = {
  kind: "あと少し。一緒にいるから。",
  calm: "完了まであとわずか。そのまま待つ。",
  coach: "ラストスパート。今がいちばん大事な時間。",
  scientist: "90秒完了まであとわずか。脳の変化が起きている。",
  future: "もうすぐ。未来の自分が近づいてくる。",
};

export function voiceCalmingLines(voice: Voice): string[] {
  const stages = CALMING_LINES[voice];
  return stages[0];
}

export function voiceVisionPrefix(voice: Voice): string {
  return VISION_PREFIXES[voice];
}

export function voiceClosingLine(voice: Voice): string {
  return CLOSING_LINES[voice];
}

export function suggestOneAction(type: UrgeType, altActions: string[]): string {
  if (altActions.length) {
    return altActions[Math.floor(Math.random() * altActions.length)];
  }
  const defaults: Record<string, string> = {
    food: "水を一杯、ゆっくり飲む",
    snack: "歯を磨く",
    sns: "スマホを画面ごと伏せて30秒",
    shopping: "カートに入れたまま24時間置く",
    latenight: "部屋の照明を一段落とす",
    porn: "立ち上がって部屋を出る",
    smoke: "深呼吸を5回",
    alcohol: "炭酸水をグラスに注ぐ",
    anger: "ゆっくり6秒、息を吐ききる",
    negative: "今見えているものを5つ声に出す",
    emotion: "胸に手を当てて10秒間そのまま",
    approval: "今日良かった瞬間を手帳にひとこと書く",
    procrastination: "2分だけやるとタイマーをセットする",
  };
  return defaults[type] ?? "深呼吸を5回";
}

export function buildFeedback(opts: {
  waitedSec: number;
  prevWaitedSec?: number;
  hour: number;
  type: UrgeType;
  voice: Voice;
  nextAction: string;
}): string[] {
  const lines: string[] = [];
  if (opts.waitedSec >= 60) {
    lines.push(`${opts.waitedSec}秒、ここにいた。それだけで脳に新しい回路が生まれている。`);
  } else {
    lines.push(`${opts.waitedSec}秒、止まれた。次はもう少し長くいられる。`);
  }
  if (opts.prevWaitedSec && opts.waitedSec > opts.prevWaitedSec) {
    lines.push(`前回より${opts.waitedSec - opts.prevWaitedSec}秒長く待てた。`);
  }
  if (opts.hour >= 22 || opts.hour < 4) {
    lines.push("深夜は衝動が強くなりやすい時間帯。今止まれたのは、それだけ価値がある。");
  }
  return lines;
}
