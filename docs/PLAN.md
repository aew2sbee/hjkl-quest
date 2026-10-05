# hjkl-quest 計画書

vimtutor の内容を「TODO を1つずつ達成して褒められる」形式で学べる Web サービス。GitHub Pages で公開する。

- モックアップ: [docs/mockup.html](./mockup.html)
- 最終更新: 2026-10-05

---

## 1. 決定事項

| 項目 | 決定内容 |
|---|---|
| リポジトリ名 | `hjkl-quest`（公開 URL: `https://<user>.github.io/hjkl-quest/`） |
| 対象ユーザー | Vim を一度も触ったことがない完全な初心者 |
| 言語 | 日本語のみ（UI と説明文は日本語、練習テキストは英語） |
| 判定 | **指定コマンドの使用を必須**とする（結果が合っていても別の方法なら再挑戦を促す） |
| 見た目 | ポップなダーク UI ＋ エディタ内部は本物の Vim らしさを維持。色は Vim のグリーンを基調 |
| レイアウト | 左: チャプター一覧 / 右上: クエスト説明＋TODO（縦並び） / 右下: エディタ（低め） |
| 開始方法 | エディタ欄のシェル画面で `vim` と入力して Enter → Vim 起動 |
| 対応端末 | MVP は PC（物理キーボード）。スマホは第2段階で独自キーバーを用意 |
| 技術 | TypeScript（Python は不採用） |
| 称号・実績 | 後で追加する（MVP には含めない） |

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
- 本番とプレビューは同じドメインなので、localStorage のキーは公開パスごとに分ける
- main への直接 push はしない

## 4. URL

```
/hjkl-quest/                 トップ（チャプター一覧）
/hjkl-quest/lesson/1-3/      レッスン画面
```

- 日本語のみ対応する。言語の振り分けや切り替えは持たない

## 5. 画面仕様

### レッスン画面
```
┌──────────┬──────────────────────────────────┐
│ CHAPTERS │ QUEST · 1.3                      │
│ 01 基本   │ x で余計な文字をやっつけよう       │
│  ✓1.1    │ 説明文（1〜2行）                  │
│  ▶1.3    │ ✅ / 🔶 / ⬜ TODO（縦並び）       │
│ 02 🔒    │               [ヒント][やり直す]  │
│ ...      ├──────────────────────────────────┤
│          │ ~/quest $ vim ▮                  │
│          │ （起動後は Vim 画面。高さは練習文の │
│          │   行数に合わせて自動で変える）      │
│          │ NORMAL  lesson1-3.txt   5,3      │
│          │ 押したキー: [j][j][x]             │
└──────────┴──────────────────────────────────┘
```

- **チャプター一覧**: クリア済み ✓、現在 ▶、未解放 🔒。幅が狭いときは現在のチャプターを横スクロールで表示
- **TODO**: 現在の課題を強調。達成するとチェックが弾むように付く。TODO が多い課題ではクリア済みを折りたたむ
- **エディタ**: 暗い背景、行番号、`~`、ステータスライン、コマンドライン。モードは色分け（NORMAL 青 / INSERT 緑 / VISUAL 紫）
- **押したキーの表示**: 直近12キー。誤ったキー（矢印など）はオレンジで表示
- **褒めトースト**: 画面下からふわっと出る。TODO 達成で小、レッスンクリアで紙吹雪＋★評価
- **IME 警告**: 日本語入力のオンを検出したら「半角英数に切り替えてね」と表示

### シェル画面（レッスン開始時）
- `~/quest $ ▮  ← vim と入力して Enter`
- `vim` または `vim lesson1-3.txt` で起動。それ以外は `zsh: command not found: xxx` とヒントを表示
- Chapter 1 は毎回入力。Chapter 2 以降は入力済みで Enter だけで起動（案）
- `:wq` を習った後のレッスンは、`:wq` でシェルに戻るとクリア（案）

### 誤った方法で達成したとき
- 「テキストは直せました！ でも今回は `dw` で挑戦してみよう」と表示し、[もう一度] ボタンで課題を始め直す
- 不正解という言葉は使わない

## 6. レッスン構成（vimtutor 準拠）

本文はそのまま転載せず、構成を参考に自作する。クレジットに vimtutor への謝辞を記載する。

| Ch | テーマ | 主なセクション |
|---|---|---|
| 1 | 基本操作 | 1.1 `hjkl` 移動 / 1.2 起動と終了 `:q!` / 1.3 `x` 削除 / 1.4 `i` 挿入 / 1.5 `A` 追記 / 1.6 保存して終了 `:wq` |
| 2 | 削除コマンド | `dw` / `d$` / オペレータとモーション / カウント `2w` / `2dw` / `dd` / `u` `U` `Ctrl-R` |
| 3 | 置換と変更 | `p` / `r` / `ce` / `c$` |
| 4 | 検索と移動 | `Ctrl-G` `G` `gg` / `/` `?` `n` `N` / `%` / `:s` |
| 5 | ファイル操作 | `:!cmd` / `:w FILE` / `v` + `:w` / `:r`（ブラウザ上の仮想ファイルで再現） |
| 6 | その他の編集 | `o` `O` / `a` / `R` / `y` `p` / `:set ic hls is` |
| 7 | ヘルプと設定 | `:help` / vimrc / 補完（ブラウザで再現できる範囲に調整） |

## 7. データ設計

1 レッスン 1 ファイルで、練習テキスト・判定と日本語の文言をまとめて定義する。

```
src/lessons/1-3.ts         練習テキスト・TODO の判定・必須コマンド・最短キー数・タイトル・説明・TODO 文・ヒント
```

```ts
// src/lessons/1-3.ts
export default defineLesson({
  id: "1-3",
  buffer: [
    "---> The ccow jumped ovverr the moon.",
  ],
  todos: [
    {
      id: "fix-cow",
      check: (s) => s.line(0).includes("The cow "),
      require: { commands: ["x"], forbid: ["arrows"] },
    },
    {
      id: "fix-over",
      check: (s) => s.line(0) === "---> The cow jumped over the moon.",
      require: { commands: ["x"] },
    },
  ],
  optimalKeys: 14,
});
```

### 判定の仕組み
- **バッファ**: テキストが目標どおりか
- **カーソル・モード**: 指定の位置・モードか
- **キー履歴**: `vim-keypress` / `vim-command-done` イベントでコマンドを記録し、`require` を満たしたかを見る
- `2dw` と `dwdw` のように複数の書き方がある課題は、課題ごとに許可するものを指定する

### 進捗データ（localStorage）
```ts
{ version: 1, lessons: { "1-3": { cleared: true, stars: 3, bestKeys: 14 } } }
```

## 8. 評価と演出

- TODO 達成: 褒めトースト（言葉はランダム）
- レッスンクリア: 紙吹雪、★評価（最短キー数との差・ヒント使用の有無で ★1〜3）
- 矢印キーを使ったら「矢印キーじゃなくて hjkl で！」と伝える
- `prefers-reduced-motion` のときはアニメーションを止める
- 効果音は第2段階以降（デフォルトはオフ）

## 9. ディレクトリ構成（予定）

```
hjkl-quest/
├─ .github/workflows/deploy.yml
├─ docs/                  計画書・モックアップ
├─ public/
├─ src/
│  ├─ components/         Sidebar, QuestPanel, VimEditor, Shell, Toast, KeyLog
│  ├─ engine/             判定エンジン・キー履歴・進捗保存
│  ├─ lessons/            レッスン定義（文言を含む）
│  ├─ layouts/
│  └─ pages/              index.astro, lesson/[id].astro
├─ tests/
└─ astro.config.mjs       base: "/hjkl-quest/"
```

## 10. マイルストーン

| # | 内容 | 完了の目安 |
|---|---|---|
| M0 | 環境構築 | Astro プロジェクト作成、本番デプロイと PR プレビューが動く |
| M1 | **MVP** | Chapter 1 の全レッスンが遊べる。シェル起動、TODO 判定、褒め演出、進捗保存 |
| M2 | レッスン拡充 | Chapter 2〜7 を追加 |
| M3 | 磨き込み | ★評価の調整、TODO 折りたたみ、トップページ、効果音 |
| M4 | スマホ対応 | 独自キーバー（Esc / Ctrl / `:` など）、レイアウト調整 |
| M5 | 称号・実績 | ランク称号、実績バッジ、共有カード |

## 11. 未決事項

- `@replit/codemirror-vim` で再現できないコマンド（`:!cmd`、`:r`、`:help` など）をどう見せるか → M2 着手前に調査
- Chapter 2 以降で `vim` の入力を省略するか
- レッスン中に XP を表示するか（称号機能を入れるまでは非表示にする案もある）
- vimtutor へのクレジットの書き方
- GitHub のユーザー名（公開 URL の確定）
