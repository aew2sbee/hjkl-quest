import { defineLesson } from './types';

const a = '---> a) Boil some water.';
const b = '---> b) Put a tea bag in the cup.';
const c = '---> c) Pour in the hot water.';
const d = '---> d) Wait three minutes.';

const text = (lines: string[]) => lines.join('\n');
const goal = text([a, b, c, d]);

export default defineLesson({
  id: '3-1',
  title: 'p で貼り付け',
  heading: 'dd と p で、紅茶の手順を並べ替えよう',
  lead: [
    '<code>dd</code> で消した行は、Vim が覚えています。<code>p</code> を押すと、覚えている行をカーソルの行の下に貼り付けます。',
    '行を消して、正しい場所の1つ上の行に移ってから <code>p</code>。手順が a) b) c) d) の順になるように並べ替えよう。',
  ],
  fileName: 'lesson3-1.txt',
  shell: true,
  buffer: [b, a, d, c],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', ':'],
  // "vim" + Enter, dd p (the cursor lands on the pasted b), j dd p
  optimalKeys: 11,
  todos: [
    {
      id: 'move-b',
      mark: b.slice(5),
      text: '<code>b)</code> の行を <code>dd</code> で消して、<code>p</code> で <code>a)</code> の下に貼る',
      hint: '<code>b)</code> の行で <code>dd</code> を押すと、<code>a)</code> の行が一番上になってカーソルが乗ります。そこで <code>p</code> を押そう。',
      praise: ['お湯を沸かしてからティーバッグ！', 'dd と p、息ぴったり！'],
      // Each move is checked on its own, so the other one may already be done.
      done: (s) => [goal, text([a, b, d, c])].includes(text(s.lines)),
      require: ['p'],
    },
    {
      id: 'move-d',
      mark: d.slice(5),
      text: '<code>d)</code> の行を <code>dd</code> で消して、<code>p</code> で <code>c)</code> の下に貼る',
      hint: '<code>d)</code> の行で <code>dd</code> を押すと、カーソルは <code>c)</code> の行に移ります。そのまま <code>p</code> を押そう。',
      praise: ['おいしい紅茶の手順が完成！', '並べ替え、お見事！'],
      done: (s) => [goal, text([b, a, c, d])].includes(text(s.lines)),
      require: ['p'],
    },
  ],
});
