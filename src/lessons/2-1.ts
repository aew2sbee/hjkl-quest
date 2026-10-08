import { defineLesson } from './types';

const goal = '---> Please keep the important words only.';

export default defineLesson({
  id: '2-1',
  title: 'dw で単語を削除',
  heading: 'dw で余計な単語を消そう',
  lead: [
    'ノーマルモードで <code>d</code> <code>w</code> と押すと、カーソルの位置から単語の終わりまでが、後ろの空白ごと消えます。',
    '消したい単語の先頭にカーソルを置いてから <code>dw</code> を押そう。<code>w</code> だけを押すと、次の単語の先頭へ進めます。',
  ],
  fileName: 'lesson2-1.txt',
  shell: true,
  buffer: ['---> Please keep very the noisy important words only.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', ':'],
  // "vim" + Enter, www to "very" and dw (the cursor lands on "the"), w to "noisy" and dw
  optimalKeys: 12,
  todos: [
    {
      id: 'delete-very',
      mark: 'very',
      text: '<code>very</code> を <code>dw</code> で消す',
      hint: '<code>w</code> を3回押すと <code>very</code> の先頭に着きます。そこで <code>d</code> <code>w</code> と押そう。',
      praise: ['単語ごとスッキリ！', 'dw、決まった！'],
      // Each fix is checked on its own, so the other word may still be there or already gone.
      done: (s) => [goal, '---> Please keep the noisy important words only.'].includes(s.lines[0]),
      require: ['dw'],
    },
    {
      id: 'delete-noisy',
      mark: 'noisy',
      text: '<code>noisy</code> を <code>dw</code> で消す',
      hint: '<code>w</code> で <code>noisy</code> の先頭に進んで、<code>dw</code> を押そう。',
      praise: ['大事な単語だけ残った！', 'x より断然速い！'],
      done: (s) => [goal, '---> Please keep very the important words only.'].includes(s.lines[0]),
      require: ['dw'],
    },
  ],
});
