import { defineLesson } from './types';

const name = '---> Name: Alice';
const hello = '---> Hello, !';
const repeat = '---> Repeat me.';

export default defineLesson({
  id: '6-4',
  title: 'y と p でコピー',
  heading: 'y でコピーして、p で貼り付けよう',
  lead: [
    '<code>v</code> で選んで <code>y</code> を押すと、選んだ所をコピーします（yank）。<code>p</code> でカーソルの後ろに貼り付けます。',
    '<code>yy</code> は行をまるごとコピーします。<code>dd</code> と同じく、<code>p</code> で下の行に貼り付けます。',
  ],
  fileName: 'lesson6-4.txt',
  shell: true,
  buffer: [name, hello, repeat],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', 'a', 'R', 'y', ':'],
  // "vim" + Enter, 3w v e y (the cursor goes back to the "A"), j p (after the space), j yy p
  optimalKeys: 15,
  todos: [
    {
      id: 'copy-name',
      mark: 'Alice',
      text: '<code>Alice</code> を <code>v</code> と <code>y</code> でコピーして、<code>Hello,</code> の後ろに <code>p</code> で貼る',
      hint: '<code>Alice</code> の先頭で <code>v</code>、<code>e</code> で終わりまで選んで <code>y</code>。<code>Hello,</code> の後ろの空白に移って <code>p</code> を押そう。',
      praise: ['こんにちは、Alice！', 'コピーと貼り付け、できた！'],
      done: (s) => s.lines[1] === '---> Hello, Alice!',
      require: ['p'],
    },
    {
      id: 'copy-line',
      mark: 'Repeat me.',
      text: '<code>Repeat me.</code> の行を <code>yy</code> でコピーして、<code>p</code> で下に貼る',
      hint: '<code>Repeat me.</code> の行で <code>y</code> を2回押し、<code>p</code> を押そう。',
      praise: ['行が2つになった！', 'yy もばっちり！'],
      done: (s) => s.lines.filter((line) => line === repeat).length === 2,
      require: ['p'],
    },
  ],
});
