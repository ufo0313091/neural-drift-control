import { useEffect, useState, useCallback } from "react";

export type UrgeType =
  | "food"
  | "sns"
  | "shopping"
  | "latenight"
  | "porn"
  | "smoke"
  | "alcohol"
  | "anger"
  | "other";

export type Trigger =
  | "fatigue"
  | "stress"
  | "anxiety"
  | "loneliness"
  | "boredom"
  | "anger"
  | "afterdrink"
  | "nosleep";

export type Outcome = "calmed" | "reduced" | "stillWant" | "acted";

export interface UrgeLog {
  id: string;
  ts: number;
  type: UrgeType;
  intensity: number; // 1-10
  trigger?: Trigger;
  waitedSec: number;
  outcome?: Outcome;
}

export interface Profile {
  goal: string;
  reason: string;
  voice: "kind" | "calm" | "coach" | "scientist" | "future";
  createdAt: number;
}

const PROFILE_KEY = "urgeos.profile";
const LOGS_KEY = "urgeos.logs";

export const URGE_LABELS: Record<UrgeType, string> = {
  food: "食欲",
  sns: "SNS",
  shopping: "衝動買い",
  latenight: "夜更かし",
  porn: "ポルノ",
  smoke: "禁煙",
  alcohol: "禁酒",
  anger: "怒り",
  other: "その他",
};

export const TRIGGER_LABELS: Record<Trigger, string> = {
  fatigue: "疲労",
  stress: "ストレス",
  anxiety: "不安",
  loneliness: "孤独",
  boredom: "暇",
  anger: "怒り",
  afterdrink: "飲酒後",
  nosleep: "睡眠不足",
};

export const OUTCOME_LABELS: Record<Outcome, string> = {
  calmed: "落ち着いた",
  reduced: "少し減った",
  stillWant: "まだしたい",
  acted: "実行した",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getProfile(): Profile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function setProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("urgeos:change"));
}

export function getLogs(): UrgeLog[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? (JSON.parse(raw) as UrgeLog[]) : [];
  } catch {
    return [];
  }
}

export function addLog(log: UrgeLog) {
  const logs = getLogs();
  logs.unshift(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 500)));
  window.dispatchEvent(new Event("urgeos:change"));
}

export function updateLog(id: string, patch: Partial<UrgeLog>) {
  const logs = getLogs().map((l) => (l.id === id ? { ...l, ...patch } : l));
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  window.dispatchEvent(new Event("urgeos:change"));
}

export function useLogs() {
  const [logs, setLogs] = useState<UrgeLog[]>([]);
  useEffect(() => {
    setLogs(getLogs());
    const h = () => setLogs(getLogs());
    window.addEventListener("urgeos:change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("urgeos:change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return logs;
}

export function useProfile() {
  const [profile, setP] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setP(getProfile());
    setReady(true);
    const h = () => setP(getProfile());
    window.addEventListener("urgeos:change", h);
    return () => window.removeEventListener("urgeos:change", h);
  }, []);
  const save = useCallback((p: Profile) => {
    setProfile(p);
    setP(p);
  }, []);
  return { profile, ready, save };
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}