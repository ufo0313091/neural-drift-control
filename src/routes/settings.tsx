import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { useLogs, useProfile } from "@/lib/storage";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useProfile();
  const logs = useLogs();
  const navigate = useNavigate();

  const resetAll = () => {
    if (!confirm("全てのデータを消去します。よろしいですか?")) return;
    localStorage.removeItem("urgeos.profile");
    localStorage.removeItem("urgeos.logs");
    window.dispatchEvent(new Event("urgeos:change"));
    navigate({ to: "/onboarding", replace: true });
  };

  const exportJson = () => {
    const data = { profile, logs };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `urgeos-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Data / Profile
          </p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">設定</h1>
        </header>

        {profile && (
          <section className="mt-8 space-y-4">
            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Goal
              </p>
              <p className="text-base font-medium">{profile.goal}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Reason
              </p>
              <p className="text-base font-light leading-relaxed">「{profile.reason}」</p>
            </div>
            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Voice
              </p>
              <p className="text-base font-medium capitalize">{profile.voice}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white/5 p-5">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Total Observations
              </p>
              <p className="text-base font-medium tabular-nums">{logs.length}</p>
            </div>
          </section>
        )}

        <section className="mt-8 space-y-3">
          <button
            onClick={() => navigate({ to: "/onboarding" })}
            className="w-full rounded-2xl border border-border bg-white/5 p-4 text-left text-sm font-medium hover:border-accent/40"
          >
            目標・理由を編集
          </button>
          <button
            onClick={exportJson}
            className="w-full rounded-2xl border border-border bg-white/5 p-4 text-left text-sm font-medium hover:border-accent/40"
          >
            データをエクスポート
          </button>
          <button
            onClick={resetAll}
            className="w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left text-sm font-medium text-destructive hover:border-destructive/60"
          >
            全てリセット
          </button>
        </section>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Urge OS / v0.1
        </p>
      </div>
      <BottomNav />
    </div>
  );
}