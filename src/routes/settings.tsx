import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useLogs, useProfile, URGE_LABELS, type UrgeType } from "@/lib/storage";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const ALL_TYPES = Object.entries(URGE_LABELS) as [UrgeType, string][];

const VOICE_LABELS: Record<string, string> = {
  kind: "優しい", calm: "冷静", coach: "コーチ風", scientist: "科学者風", future: "未来の自分",
};

function SettingsPage() {
  const { profile, patch } = useProfile();
  const logs = useLogs();
  const navigate = useNavigate();
  const [showTypeEditor, setShowTypeEditor] = useState(false);

  const resetAll = () => {
    if (!confirm("全てのデータを消去します。よろしいですか?")) return;
    localStorage.removeItem("urgeos.profile");
    localStorage.removeItem("urgeos.logs");
    window.dispatchEvent(new Event("urgeos:change"));
    navigate({ to: "/onboarding", replace: true });
  };

  const exportJson = () => {
    const data = { profile, logs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `urgeos-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const changePrimaryType = (type: UrgeType) => {
    patch({ primaryType: type });
    setShowTypeEditor(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">データ / プロフィール</p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">設定</h1>
        </header>

        {profile && (
          <section className="mt-8 space-y-4">
            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 text-[10px] tracking-widest text-muted-foreground">目標</p>
              <p className="text-base font-medium">{profile.goal}</p>
            </div>

            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-[10px] tracking-widest text-muted-foreground">最重要目標タイプ</p>
                  <p className="text-base font-medium">{URGE_LABELS[profile.primaryType ?? "other"]}</p>
                </div>
                <button onClick={() => setShowTypeEditor((v) => !v)}
                  className="rounded-full border border-accent/40 px-3 py-1.5 text-[10px] tracking-wide text-accent hover:bg-accent/10">
                  変更
                </button>
              </div>
              {showTypeEditor && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {ALL_TYPES.map(([k, v]) => (
                    <button key={k} onClick={() => changePrimaryType(k)}
                      className={
                        "rounded-xl border p-3 text-left text-xs transition-colors " +
                        (profile.primaryType === k
                          ? "border-accent/60 bg-accent/10 text-accent"
                          : "border-border bg-white/[0.03] text-muted-foreground hover:text-foreground")
                      }
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 text-[10px] tracking-widest text-muted-foreground">あなたの理由</p>
              <p className="text-base font-light leading-relaxed">「{profile.reason}」</p>
            </div>

            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 text-[10px] tracking-widest text-muted-foreground">通知の声</p>
              <p className="text-base font-medium">{VOICE_LABELS[profile.voice] ?? profile.voice}</p>
            </div>

            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 text-[10px] tracking-widest text-muted-foreground">記録の合計</p>
              <p className="text-base font-medium tabular-nums">{logs.length}</p>
            </div>
          </section>
        )}

        <section className="mt-8 space-y-3">
          <button onClick={() => navigate({ to: "/onboarding" })}
            className="w-full rounded-2xl border border-border bg-white/5 p-4 text-left text-sm font-medium hover:border-accent/40">
            目標・理由を編集
          </button>
          <button onClick={() => navigate({ to: "/future" })}
            className="w-full rounded-2xl border border-accent/30 bg-accent/5 p-4 text-left text-sm font-medium hover:border-accent/60">
            未来設計を編集（理想・対策）
          </button>
          <button onClick={exportJson}
            className="w-full rounded-2xl border border-border bg-white/5 p-4 text-left text-sm font-medium hover:border-accent/40">
            データをエクスポート
          </button>
          <button onClick={resetAll}
            className="w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left text-sm font-medium text-destructive hover:border-destructive/60">
            全てリセット
          </button>
        </section>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link to="/privacy" className="text-[10px] tracking-widest text-muted-foreground hover:text-foreground">
            プライバシーポリシー
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">衝動コントロール / v0.2</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
