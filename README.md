# ashitaHARESORA′ 開発用サイト

このリポジトリは `ashitaharesora/ashitaharesora-dev` 専用です。
公開URLは https://ashitaharesora.github.io/ashitaharesora-dev/ です。

## 公開方法
- GitHub Settings → Pages → Source は **Deploy from a branch**、Branch は **main / (root)** を使用します。
- Custom domain は空欄にします。`main`・`gh-pages` に `CNAME` を追加しないでください。
- `main` へのpushでGitHub標準の `pages-build-deployment` だけが公開します。独自のデプロイ用Actionsは使用しません。
- `_config.yml` でテンプレート、生成スクリプト、保存した参考ページを公開対象から除外しています。

## 開発環境の分離
- 全公開HTMLに `noindex,nofollow,noarchive` を付け、Google Analytics・Clarityは読み込みません。
- 相対リンクはそのまま使用し、ルート相対リンクと旧URLの転送先は `/ashitaharesora-dev/` 配下に統一します。
- `404.html` の `base` により、存在しない深いURLでも画像・CSS・ナビゲーションを開発サイト内で解決します。
- `robots.txt` はクロール禁止ですが、プロジェクトサイトのrobots.txtだけでは検索登録を防げないため、各HTMLの `noindex` を必須にしています。
- HTML追加・記事生成後は `npm run apply:head`、確認は `node scripts/apply-head-analytics.mjs --check` を実行してください。このコマンドは互換性のため旧名ですが、開発用の検索登録防止・解析除去・URL補正を行います。
- 本番用リポジトリ、Cloudflare、DNSはこのリポジトリの公開操作に使用しません。本番用APIキーをファイルに記載しないでください。

## 含めたもの
- 固定ページ: トップ / 事務所案内 / サービス / FAQ / お問い合わせ / アクセス / プライバシーポリシー
- 一覧・詳細: お知らせ / ブログ / 支援事例
- 共通化: `assets/css/style.css` と `assets/js/main.js`
- microCMS 連携のたたき台: `scripts/fetch-microcms.mjs` `scripts/build-pages.mjs`
- GitHub Pages のブランチ公開設定
- `robots.txt` `sitemap.xml` `404.html`

## microCMS連携
ブランチ公開ではmicroCMSへの接続やSecretsの取得は行いません。必要な場合だけ、開発用の設定で手元で記事を生成し、`npm run apply:head` を実行してからHTMLをコミットしてください。

## 補足
- 事例ページは **掲載イメージ** です。公開時は実際の匿名化事例に差し替えてください。
- 旧URL からの移行を考えて、必要なら旧ファイル名のリダイレクトページを残してください。
