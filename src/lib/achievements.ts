import type { UrgeLog, Profile } from "./storage";
import { calcOvercomeCount, calcStreak } from "./storage";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  category: "overcome" | "streak" | "explore" | "courage" | "habit";
  check: (logs: UrgeLog[], profile: Profile | null) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // 乗り越え系
  {
    id: "overcome_1",
    icon: "✦",
    title: "最初の一歩",
    desc: "衝動を初めて乗り越えた。この瞬間が、全ての始まり。",
    category: "overcome",
    check: (logs) => calcOvercomeCount(logs) >= 1,
  },
  {
    id: "overcome_5",
    icon: "🌱",
    title: "芽吹き",
    desc: "5回乗り越えた。脳に新しい回路が生まれている。",
    category: "overcome",
    check: (logs) => calcOvercomeCount(logs) >= 5,
  },
  {
    id: "overcome_10",
    icon: "🌿",
    title: "根が張りはじめた",
    desc: "10回乗り越えた。習慣の土台ができてきた。",
    category: "overcome",
    check: (logs) => calcOvercomeCount(logs) >= 10,
  },
  {
    id: "overcome_25",
    icon: "🌊",
    title: "波乗り師",
    desc: "25回の波を乗り越えた。あなたは波と踊れている。",
    category: "overcome",
    check: (logs) => calcOvercomeCount(logs) >= 25,
  },
  {
    id: "overcome_50",
    icon: "🔥",
    title: "鋼の意識",
    desc: "50回乗り越えた。これは意志ではなく、新しいあなた自身。",
    category: "overcome",
    check: (logs) => calcOvercomeCount(logs) >= 50,
  },
  {
    id: "overcome_100",
    icon: "💎",
    title: "百の波",
    desc: "100回乗り越えた。脳が根本から変わった証。",
    category: "overcome",
    check: (logs) => calcOvercomeCount(logs) >= 100,
  },
  {
    id: "overcome_200",
    icon: "🌌",
    title: "星の軌道",
    desc: "200回乗り越えた。もうあなたの中に別の自分がいる。",
    category: "overcome",
    check: (logs) => calcOvercomeCount(logs) >= 200,
  },

  // 記録ストリーク系
  {
    id: "streak_3",
    icon: "📅",
    title: "3日間の観察者",
    desc: "3日連続で記録した。習慣の種が蒔かれた。",
    category: "streak",
    check: (logs) => calcStreak(logs) >= 3,
  },
  {
    id: "streak_7",
    icon: "🗓",
    title: "一週間の見届け人",
    desc: "7日連続で記録した。一週間分の自分のパターンが見えてくる。",
    category: "streak",
    check: (logs) => calcStreak(logs) >= 7,
  },
  {
    id: "streak_14",
    icon: "🌙",
    title: "満月の記録者",
    desc: "14日連続で記録した。脳の変化を感じ始める頃。",
    category: "streak",
    check: (logs) => calcStreak(logs) >= 14,
  },
  {
    id: "streak_30",
    icon: "🏔",
    title: "山の頂",
    desc: "30日連続で記録した。1ヶ月間、自分と向き合い続けた。",
    category: "streak",
    check: (logs) => calcStreak(logs) >= 30,
  },

  // 探索系
  {
    id: "explorer",
    icon: "🗺",
    title: "自己探求者",
    desc: "5種類以上の衝動を記録した。自分のパターンが広く見えている。",
    category: "explore",
    check: (logs) => new Set(logs.map((l) => l.type)).size >= 5,
  },
  {
    id: "first_log",
    icon: "📓",
    title: "記録の始まり",
    desc: "初めて記録した。観察することが、変化の第一歩。",
    category: "explore",
    check: (logs) => logs.length >= 1,
  },
  {
    id: "ten_logs",
    icon: "📚",
    title: "10回の観察",
    desc: "10回記録した。これだけのデータで、パターンが見えてくる。",
    category: "explore",
    check: (logs) => logs.length >= 10,
  },
  {
    id: "trigger_finder",
    icon: "🔍",
    title: "引き金ハンター",
    desc: "5回以上、引き金を記録した。原因が分かれば、対策が立てられる。",
    category: "explore",
    check: (logs) => logs.filter((l) => l.trigger).length >= 5,
  },

  // 勇気系
  {
    id: "high_intensity",
    icon: "⚡",
    title: "嵐を超えた",
    desc: "強度8以上の衝動を乗り越えた。最も強い波を、観察で乗り越えた。",
    category: "courage",
    check: (logs) =>
      logs.some(
        (l) =>
          l.intensity >= 8 &&
          (l.outcome === "calmed" ||
            l.outcome === "reduced" ||
            (!l.outcome && l.waitedSec >= 60)),
      ),
  },
  {
    id: "midnight_warrior",
    icon: "🌃",
    title: "深夜の守護者",
    desc: "深夜（22時〜4時）の衝動を乗り越えた。最も誘惑が強い時間を制した。",
    category: "courage",
    check: (logs) =>
      logs.some((l) => {
        const h = new Date(l.ts).getHours();
        const isNight = h >= 22 || h < 4;
        const overcome =
          l.outcome === "calmed" ||
          l.outcome === "reduced" ||
          (!l.outcome && l.waitedSec >= 60);
        return isNight && overcome;
      }),
  },
  {
    id: "comeback",
    icon: "🔄",
    title: "再起",
    desc: "実行してしまった後も、また記録した。完璧じゃなくていい。続けることが勝ち。",
    category: "courage",
    check: (logs) => {
      let foundActed = false;
      for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].outcome === "acted") foundActed = true;
        else if (foundActed && logs[i].ts > (logs.find((l) => l.outcome === "acted")?.ts ?? 0)) return true;
      }
      const actedIdx = logs.findIndex((l) => l.outcome === "acted");
      return actedIdx > 0;
    },
  },
  {
    id: "full_surf",
    icon: "🏄",
    title: "完走",
    desc: "90秒間、衝動を最後まで観察した。波が引くのを自分の目で確かめた。",
    category: "courage",
    check: (logs) => logs.some((l) => l.waitedSec >= 88),
  },

  // 習慣系
  {
    id: "week_active",
    icon: "📈",
    title: "週次実践者",
    desc: "1週間で7回以上記録した。衝動との向き合い方が生活に溶け込んでいる。",
    category: "habit",
    check: (logs) => {
      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      return logs.filter((l) => l.ts >= weekAgo).length >= 7;
    },
  },
  {
    id: "type_master",
    icon: "🎯",
    title: "タイプ制覇",
    desc: "同じ種類の衝動を10回乗り越えた。このパターンの専門家になった。",
    category: "habit",
    check: (logs) => {
      const counts = new Map<string, number>();
      for (const l of logs) {
        const overcome =
          l.outcome === "calmed" ||
          l.outcome === "reduced" ||
          (!l.outcome && l.waitedSec >= 60);
        if (overcome) counts.set(l.type, (counts.get(l.type) ?? 0) + 1);
      }
      return [...counts.values()].some((v) => v >= 10);
    },
  },
];

const SEEN_KEY = "urgeos.seen_achievements";

export function getEarnedIds(logs: UrgeLog[], profile: Profile | null): string[] {
  return ACHIEVEMENTS.filter((a) => a.check(logs, profile)).map((a) => a.id);
}

export function getNewlyEarned(logs: UrgeLog[], profile: Profile | null): Achievement[] {
  const earned = getEarnedIds(logs, profile);
  const seen = new Set<string>(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
  const newOnes = ACHIEVEMENTS.filter((a) => earned.includes(a.id) && !seen.has(a.id));
  if (newOnes.length > 0) {
    const next = new Set([...seen, ...newOnes.map((a) => a.id)]);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
  }
  return newOnes;
}

export function markAchievementsSeen(ids: string[]) {
  const seen = new Set<string>(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
  for (const id of ids) seen.add(id);
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

export const CATEGORY_LABELS: Record<Achievement["category"], string> = {
  overcome: "乗り越え",
  streak:   "連続記録",
  explore:  "探求",
  courage:  "勇気",
  habit:    "習慣",
};
