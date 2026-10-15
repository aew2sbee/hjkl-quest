import { defineLesson, type Snapshot } from './types';

const head = ['---> Things to bring to the picnic:', '---> a blanket', '---> the food in part.txt:'];
const end = '---> See you at noon!';
// What 5.3 wrote. It is here from the start, so this lesson works without 5.3.
const part = ['---> apples', '---> bread', '---> cheese'];
const listing = 'lesson5-4.txt  part.txt';

const has = (s: Snapshot, lines: string[], at: number) => s.lines.slice(at, at + lines.length).join('\n') === lines.join('\n');

export default defineLesson({
  id: '5-4',
  title: ':r でファイルを読み込む',
  heading: ':r で、ほかのファイルの中身を取り込もう',
  lead: [
    '<code>:r ファイル名</code> と打つと、そのファイルの中身をカーソルの行の下に読み込みます。',
    '<code>:r !ls</code> のように <code>!</code> を付けると、コマンドの出力を読み込めます。',
  ],
  fileName: 'lesson5-4.txt',
  shell: true,
  buffer: [...head, end],
  files: { 'part.txt': part },
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', ':'],
  // "vim" + Enter, ":3r part.txt" Enter (a line number reads under that line), ":$r!ls" Enter
  optimalKeys: 24,
  todos: [
    {
      id: 'read-file',
      mark: 'the food in part.txt:',
      text: '<code>the food in part.txt:</code> の行の下に、<code>:r part.txt</code> で <code>part.txt</code> を読み込む',
      hint: '光っている行に下りて、<code>:r part.txt</code> と打って Enter を押そう。',
      praise: ['お弁当がそろった！', 'ファイルの中身を取り込めた！'],
      done: (s) => has(s, [...head, ...part, end], 0),
      // A line number or $ before r reads under that line instead of the cursor's.
      require: [':r part.txt', /^:[\d$.]*r(ead)?\s+part\.txt\s*$/],
    },
    {
      id: 'read-command',
      mark: 'See you at noon!',
      text: '最後の行の下に、<code>:r !ls</code> でファイルの一覧を読み込む',
      hint: '<code>G</code> で最後の行へ移って、<code>:r !ls</code> と打って Enter を押そう。',
      praise: ['コマンドの出力まで取り込めた！', 'これで Chapter 5 制覇！'],
      done: (s) => s.lines.at(-1) === listing && s.lines.at(-2) === end,
      require: [':r !ls', /^:[\d$.]*r(ead)?\s*!\s*ls\s*$/],
    },
  ],
});
