import { defineLesson } from './types';

const goal = '---> My dog likes to chase red balls.';

/** True when `goal` can still be made from `line` by deleting characters only. */
const reachableByDeleting = (line: string) => {
  let i = 0;
  for (const ch of line) if (ch === goal[i]) i++;
  return i === goal.length;
};

export default defineLesson({
  id: '1-3',
  title: 'x で削除',
  heading: 'x で余計な文字を消そう',
  lead: [
    'ノーマルモードで <code>x</code> を押すと、カーソルの下の1文字が消えます。',
    '<code>h</code> <code>j</code> <code>k</code> <code>l</code> で余計な文字の上に移動してから、<code>x</code> を押そう。',
    '消しすぎたときは「やり直す」で最初に戻せます。',
  ],
  fileName: 'lesson1-3.txt',
  shell: true,
  buffer: ['---> My doog likess to chasee red balls.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', ':'],
  // "vim" + Enter, then doog: 9l x, likess: 7l x, chasee: 9l x (deleting the second of each doubled letter)
  optimalKeys: 32,
  todos: [
    {
      id: 'fix-dog',
      text: '<code>doog</code> を <code>dog</code> にする',
      hint: '<code>l</code> で <code>o</code> の上まで進んで、<code>x</code> を1回押そう。',
      praise: ['一撃で消した！', 'x の使い方はばっちり！'],
      done: (s) => s.lines[0].includes(' dog '),
    },
    {
      id: 'fix-likes',
      text: '<code>likess</code> を <code>likes</code> にする',
      hint: '最後の <code>s</code> の上まで <code>l</code> で進んで、<code>x</code> を押そう。',
      praise: ['いい調子！', 'どんどん直ってきた！'],
      done: (s) => s.lines[0].includes(' likes '),
    },
    {
      id: 'fix-chase',
      text: '<code>chasee</code> を <code>chase</code> にする',
      hint: '最後の <code>e</code> の上まで <code>l</code> で進んで、<code>x</code> を押そう。',
      praise: ['完璧な文になった！', 'もう x は怖くない！'],
      done: (s) => s.lines[0] === goal,
    },
  ],
  stuck: (s) => !reachableByDeleting(s.lines[0]),
});
