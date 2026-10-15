import { defineLesson, type Snapshot } from './types';

const fixed = (line: string) => line.replaceAll('recieve', 'receive');

const buffer = [
  '---> I recieve mail, recieve calls and recieve gifts.',
  '---> Did you recieve my letter? I did not recieve yours.',
  '---> We all recieve a prize if we recieve the most votes.',
];

// Substitutes by their flags, whatever the pattern: the learner may type a shorter one than the word.
const once = /^:s\/[^/]*\/[^/]*\/?$/;
const lineWide = /^:s\/[^/]*\/[^/]*\/g$/;
const fileWide = /^:%s\/[^/]*\/[^/]*\/g$/;

const firstOnly = (s: Snapshot) => s.lines[0].startsWith('---> I receive mail,');

export default defineLesson({
  id: '4-4',
  title: ':s で置換',
  heading: ':s で、つづりのまちがいをまとめて直そう',
  lead: [
    '<code>:s/old/new</code> と打って Enter を押すと、カーソルの行で最初の <code>old</code> を <code>new</code> に置き換えます。最後に <code>/g</code> を付けると、その行の全部を置き換えます。',
    '<code>:%s/old/new/g</code> はファイル全体です。<code>%</code> は「すべての行」という意味です。',
  ],
  fileName: 'lesson4-4.txt',
  shell: true,
  buffer,
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', ':'],
  // "vim" + Enter, ":s/ie/ei" Enter, ":s//ei/g" Enter (an empty pattern is the last one), ":%s//ei/g" Enter
  optimalKeys: 32,
  todos: [
    {
      id: 'first',
      mark: 'recieve',
      text: '<code>:s/recieve/receive</code> で、1行目の最初の <code>recieve</code> だけを直す',
      hint: '<code>:</code> を押して <code>s/recieve/receive</code> と打ち、Enter を押そう。<code>/g</code> はまだ付けません。',
      praise: ['まずは1つ直った！', ':s、使えたね！'],
      done: firstOnly,
      require: [':s/recieve/receive', once],
    },
    {
      id: 'line',
      mark: 'recieve',
      text: '<code>:s/recieve/receive/g</code> で、1行目の残りを全部直す',
      hint: 'さっきの置換の最後に <code>/g</code> を付けよう。<code>g</code> は「行の中の全部」という意味です。',
      praise: ['1行まるごときれいになった！', '/g の力だ！'],
      done: (s) => s.lines[0] === fixed(buffer[0]),
      require: [':s/recieve/receive/g', lineWide],
    },
    {
      id: 'file',
      mark: 'recieve',
      text: '<code>:%s/recieve/receive/g</code> で、残りの行を1回で全部直す',
      hint: '<code>:</code> のあとに <code>%</code> を付けると、すべての行が置換の対象になります。',
      praise: ['ファイル全体が直った！', '置換マスター！ Chapter 4 制覇！'],
      done: (s) => s.lines[1] === fixed(buffer[1]) && s.lines[2] === fixed(buffer[2]),
      require: [':%s/recieve/receive/g', fileWide],
    },
  ],
});
