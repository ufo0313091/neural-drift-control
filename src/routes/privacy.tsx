import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white/5 p-5">
      <p className="mb-2 text-[10px] tracking-widest text-accent">{title}</p>
      <div className="space-y-1 text-sm font-light leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-6 pt-12 pb-20">
        <header className="animate-fade-in-up">
          <p className="text-[10px] tracking-[0.3em] text-accent">法的情報</p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">プライバシーポリシー</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">最終更新日：2025年6月</p>
        </header>

        <div className="mt-8 space-y-4">
          <Section title="1. 基本方針">
            <p>衝動コントロール（以下「本アプリ」）は、ユーザーのプライバシーを最大限に尊重します。本アプリは、ユーザーの個人情報を外部サーバーに送信・収集しません。</p>
          </Section>

          <Section title="2. 収集する情報">
            <p>本アプリは以下のデータをあなたのデバイス上のみに保存します：</p>
            <ul className="mt-2 space-y-1 pl-4 text-muted-foreground">
              <li>・ 設定した目標・理由・声のタイプ</li>
              <li>・ 衝動の記録（種類・強度・引き金・結果）</li>
              <li>・ 未来設計の内容（ビジョン・代替行動）</li>
              <li>・ サウンド設定・バナーの非表示設定</li>
            </ul>
          </Section>

          <Section title="3. 外部送信について">
            <p>本アプリは外部サーバーへのデータ送信を一切行いません。インターネット接続なしでも全機能が使用できます。</p>
          </Section>

          <Section title="4. 第三者への提供">
            <p>ユーザーのデータを第三者に販売・提供・共有することはありません。</p>
          </Section>

          <Section title="5. データの保存場所">
            <p>全データはお使いのデバイスのローカルストレージ（localStorage）に保存されます。アプリを削除すると、全データも削除されます。バックアップは設定ページから手動でエクスポートできます。</p>
          </Section>

          <Section title="6. アクセス許可">
            <p>本アプリが要求する権限：</p>
            <ul className="mt-2 space-y-1 pl-4 text-muted-foreground">
              <li>・ 音声出力（サウンド機能のみ）</li>
            </ul>
            <p className="mt-2">位置情報・カメラ・連絡先・マイクなどの権限は要求しません。</p>
          </Section>

          <Section title="7. 未成年者について">
            <p>本アプリは13歳以上を対象としています。13歳未満の方の使用はご遠慮ください。</p>
          </Section>

          <Section title="8. ポリシーの変更">
            <p>本ポリシーを変更する場合は、アプリ内でお知らせします。継続的な使用をもって変更に同意したものとみなします。</p>
          </Section>

          <Section title="9. お問い合わせ">
            <p>プライバシーに関するご質問は、App Storeのレビューまたはサポートページからお寄せください。</p>
          </Section>
        </div>

        <div className="mt-8 text-center">
          <Link to="/settings" className="text-[10px] tracking-widest text-muted-foreground hover:text-foreground">
            ← 設定に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
