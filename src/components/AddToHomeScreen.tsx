import { useEffect, useState } from "react";

const DISMISSED_KEY = "urgeos.ath_dismissed";

type Env = "ios" | "android" | null;

function detectEnv(): Env {
  if (
    (window.navigator as { standalone?: boolean }).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  )
    return null;
  const ua = window.navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !/CriOS|FxiOS/i.test(ua))
    return "ios";
  if (/Android/i.test(ua)) return "android";
  return null;
}

export function AddToHomeScreen() {
  const [env, setEnv] = useState<Env>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    const e = detectEnv();
    setEnv(e);
    if (e) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible || !env) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="mb-2 text-[11px] font-medium tracking-wide text-accent">
            ホーム画面に追加する
          </p>
          {env === "ios" ? (
            <ol className="space-y-1 text-xs text-muted-foreground">
              <li>1. 下部の <span className="text-foreground">共有ボタン</span> をタップ</li>
              <li>2. <span className="text-foreground">「ホーム画面に追加」</span> を選択</li>
              <li>3. 右上の <span className="text-foreground">「追加」</span> をタップ</li>
            </ol>
          ) : (
            <p className="text-xs text-muted-foreground">
              ブラウザのメニュー →{" "}
              <span className="text-foreground">「ホーム画面に追加」</span>{" "}
              でアプリとして使えます。
            </p>
          )}
        </div>
        <button
          onClick={dismiss}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
