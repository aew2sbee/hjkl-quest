# hjkl-quest

vimtutor の構成をもとに、TODO をクリアしながらブラウザで Vim を学べるサイト。Astro + TypeScript で静的に出力し、GitHub Pages で公開する。

文書は `docs/` にある。各項目はどれか 1 つの文書にだけ書き、ほかからはリンクする。

- [docs/plan.md](docs/plan.md): 計画。技術構成、開発の流れ、ディレクトリ構成、マイルストーン
- [docs/spec.md](docs/spec.md): 仕様。画面、レッスンの定義、判定、進捗データ、演出
- [docs/lessons.md](docs/lessons.md): レッスンごとの練習文と TODO
- [docs/mockup.html](docs/mockup.html): 画面のモックアップ

## 守ること

- **vimtutor の本文や練習文を転載しない。** 構成だけを参考にし、説明文と練習テキストは自作する。
- **日本語のみ。** UI と説明文は日本語、練習テキストは英語。言語の切り替えは作らない。
- **main へは PR 経由だけ。** 作業は `feat/xxx` などのブランチで行う。PR ごとに `https://aew2sbee.github.io/hjkl-quest/pr-preview/pr-<番号>/` にプレビューが出るので、オーナーが確認してからマージする。
- **localStorage のキーには `storagePrefix`（`src/env.ts`）を付ける。** 本番と PR プレビューは同じオリジンなので、付けないと進捗が混ざる。
- 仕様や計画と実装がずれたら、該当する文書も同じ PR で更新する。

## コマンド

```sh
npm run dev      # http://localhost:4321/hjkl-quest/
npm run build
```
