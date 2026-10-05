# hjkl-quest 計画書

vimtutor の内容を「TODO を1つずつ達成して褒められる」形式で学べる Web サービス。GitHub Pages で公開する。

この文書には、技術の選び方、開発の進め方、マイルストーンを書く。サービスの動きは [spec.md](spec.md)、レッスンごとの内容は [lessons.md](lessons.md) に書く。

- 最終更新: 2026-10-05

---

## 1. 決定事項

| 項目 | 決定内容 |
|---|---|
| リポジトリ名 | `hjkl-quest`（公開 URL: `https://aew2sbee.github.io/hjkl-quest/`） |
| 技術 | TypeScript（Python は不採用） |
| 対応端末 | MVP は PC（物理キーボード）。スマホは M4 で対応する |
| 称号・実績 | 後で追加する（MVP には含めない） |
| vimtutor の扱い | 本文と練習文は転載せず、構成だけを参考に自作する。README の Credits に謝辞を書く |

## 2. 技術構成

| 項目 | 採用 | 理由 |
|---|---|---|
| フレームワーク | Astro + TypeScript | ページを静的に出力でき、GitHub Pages と相性が良い |
| エディタ | CodeMirror 6 + `@replit/codemirror-vim` | Vim エミュレーションの完成度が高く、キー入力やコマンド実行のイベントを取得できる |
| 状態保存 | localStorage | サーバー不要 |
| 演出 | 自前の canvas 紙吹雪（または canvas-confetti） | 軽量 |
| デプロイ | GitHub Actions → `gh-pages` ブランチ → GitHub Pages | 本番は main へのマージで公開、PR ごとにプレビューを公開 |
| テスト | Vitest（判定ロジック）＋ Playwright（主要な操作の E2E） | 判定のバグは体験を壊すため |

## 3. 開発の流れと検証環境

**main には、オーナーが画面で動作確認したものだけを入れる。**

```
feat/xxx ブランチで作業
  ↓ PR を作成（main 向け）
PR プレビューが自動で公開される
  https://aew2sbee.github.io/hjkl-quest/pr-preview/pr-<番号>/
  ↓ オーナーが動作と画面を確認
OK ならマージ → 本番 https://aew2sbee.github.io/hjkl-quest/ に反映
PR を閉じるとプレビューは自動で削除
```

- Pages の公開元は `gh-pages` ブランチ。本番はルート、プレビューは `pr-preview/` 以下に置く
- プレビューでは画面に `PREVIEW` バッジを出し、`noindex` を付ける
- 本番とプレビューは同じドメインなので、localStorage のキーは公開パスごとに分ける（`src/env.ts` の `storagePrefix`）
- main への直接 push はしない
- 仕様を変える PR では、[spec.md](spec.md) と [lessons.md](lessons.md) も同じ PR で更新する

## 4. ディレクトリ構成（予定）

```
hjkl-quest/
├─ .claude/settings.json  Claude Code のプロジェクト設定
├─ .github/workflows/     deploy.yml（本番）、preview.yml（PR プレビュー）
├─ docs/                  計画書・仕様書・レッスン設計・モックアップ
├─ public/
├─ src/
│  ├─ components/         Sidebar, QuestPanel, VimEditor, Shell, Toast, KeyLog
│  ├─ engine/             判定エンジン・キー履歴・進捗保存
│  ├─ lessons/            レッスン定義（文言を含む）
│  ├─ layouts/
│  ├─ pages/              index.astro, lesson/[id].astro
│  └─ env.ts              本番とプレビューの判定、localStorage のキーの接頭辞
├─ tests/
└─ astro.config.mjs       base: "/hjkl-quest/"
```

## 5. マイルストーン

| # | 内容 | 完了の目安 |
|---|---|---|
| M0 | 環境構築 | Astro プロジェクト作成、本番デプロイと PR プレビューが動く |
| M1 | **MVP** | Chapter 1 の全レッスンが遊べる。シェル起動、TODO 判定、褒め演出、進捗保存 |
| M2 | レッスン拡充 | Chapter 2〜7 を追加 |
| M3 | 磨き込み | ★評価の調整、TODO 折りたたみ、トップページ、効果音 |
| M4 | スマホ対応 | 独自キーバー（Esc / Ctrl / `:` など）、レイアウト調整 |
| M5 | 称号・実績 | ランク称号、実績バッジ、共有カード |

## 6. 未決事項

- `@replit/codemirror-vim` で再現できないコマンド（`:!cmd`、`:r`、`:help` など）をどう作るか → M2 着手前に調査
- ブラウザのショートカットと重なるキー（`Ctrl-R` `Ctrl-G` `Ctrl-O` `Ctrl-D`）をエディタで受け取れるか → M1 の最初に確かめる

サービスの動きについての未決事項は [spec.md](spec.md)、レッスンについては [lessons.md](lessons.md) に書く。
