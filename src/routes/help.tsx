import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/help")({
  component: HelpPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white/5 p-5">
      <p className="mb-3 text-[10px] tracking-widest text-accent">{title}</p>
      <div className="space-y-2 text-sm font-light leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

function Q({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="font-medium text-foreground">{q}</p>
      <p className="mt-1 text-muted-foreground">{a}</p>
    </div>
  );
}

function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-32">
        <header className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">使い方</p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">ヘルプ</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">よくある疑問と、アプリの使い方をまとめました。</p>
        </header>

        <div className="mt-8 space-y-4">
          <Section title="このアプリの目的">
            <Q
              q="何をするアプリですか？"
              a="衝動が来た瞬間に開いて、90秒間その波を観察するアプリです。我慢や抑圧ではなく、衝動をただ眺めることで、自然に波が引くのを待ちます。"
            />
            <Q
              q="毎日使うアプリですか？"
              a="いいえ。これは緊急対応アプリです。衝動が来た瞬間だけ開いてください。日課として使う必要はありません。"
            />
          </Section>

          <Section title="90秒の科学">
            <Q
              q="なぜ90秒？"
              a="神経科学者のジル・ボルト・テイラーの研究によると、感情の生理反応（アドレナリンなど）のピークは約90秒で収まります。90秒待てると、脳が選択できる状態に戻ります。"
            />
            <Q
              q="90秒待てない場合は？"
              a="30秒でも効果があります。「先へ進む」ボタンで途中で終了しても構いません。記録できた時点で前進です。"
            />
          </Section>

          <Section title="記録について">
            <Q
              q="毎回全部入力しないといけませんか？"
              a="いいえ。引き金はスキップできます。衝動の種類と強度だけで記録できます。"
            />
            <Q
              q="「実行してしまった」を選ぶとペナルティはありますか？"
              a="ありません。このアプリに失敗の概念はありません。記録することで、次に役立つパターンが見えてきます。"
            />
            <Q
              q="記録はどこに保存されますか？"
              a="全てあなたのスマートフォンのローカルに保存されます。サーバーには送信されません。"
            />
          </Section>

          <Section title="ホーム画面の見方">
            <Q
              q="「連続日数」とは？"
              a="衝動を記録した（観察した）日が何日連続しているかを表します。結果に関わらず、記録した日がカウントされます。"
            />
            <Q
              q="「乗り越えた」とは？"
              a="「衝動が収まった」「少し落ち着いた」を選んだ回数、または60秒以上観察した回数の合計です。"
            />
            <Q
              q="タイプ別の数値（節約額・時間など）はどう計算していますか？"
              a="おおよその推定値です。食事なら1回あたり350kcal、タバコなら65円などを目安に計算しています。正確な計算ではなく、積み重ねを実感するための目安です。"
            />
          </Section>

          <Section title="サウンドについて">
            <Q
              q="音はどんな時に使えますか？"
              a="90秒の観察中にサウンドボタンが表示されます。雨・波・森・瞑想音から選べます。音があると、呼吸を合わせやすくなる方が多いです。"
            />
            <Q
              q="イヤホンなしで使えますか？"
              a="はい。ただし、公共の場では音量に注意してください。「なし」を選べば無音で使えます。"
            />
          </Section>

          <Section title="データ・プライバシー">
            <Q
              q="データのバックアップは？"
              a="設定ページの「データをエクスポート」でJSON形式で保存できます。アプリを削除するとデータも消えます。"
            />
            <Q
              q="個人情報は収集されますか？"
              a="一切収集されません。全データはデバイス内にのみ保存されます。詳しくはプライバシーポリシーをご確認ください。"
            />
          </Section>

          <Section title="設定・カスタマイズ">
            <Q
              q="声のタイプを途中で変えられますか？"
              a="はい。設定ページから「目標・理由を編集」で変更できます。"
            />
            <Q
              q="主目標タイプを変えたい場合は？"
              a="設定ページの「最重要目標タイプ」から変更できます。ホーム画面の統計に反映されます。"
            />
          </Section>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
