import { defineLesson } from './types';

const milk = '---> milk';
const elephant = '---> a purple elephant';
const bread = '---> bread';
const moon = '---> the moon';
const sock = '---> a lost sock';
const eggs = '---> eggs';

const text = (lines: string[]) => lines.join('\n');
const goal = text([milk, bread, eggs]);

export default defineLesson({
  id: '2-6',
  title: 'dd で行を削除',
  heading: 'dd で買い物メモの余計な行を消そう',
  lead: [
    'ノーマルモードで <code>d</code> を2回、<code>dd</code> と押すと、カーソルのある行がまるごと消えます。',
    '<code>2dd</code> のように数字を先に打つと、カーソルの行から下へその数の行を消せます。',
  ],
  fileName: 'lesson2-6.txt',
  shell: true,
  buffer: [milk, elephant, bread, moon, sock, eggs],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':'],
  // "vim" + Enter, j dd (the cursor lands on "bread"), j 2dd
  optimalKeys: 11,
  todos: [
    {
      id: 'cut-elephant',
      mark: 'a purple elephant',
      text: '<code>a purple elephant</code> の行を <code>dd</code> で消す',
      hint: '<code>j</code> で2行目に下りて、<code>d</code> を2回押そう。',
      praise: ['ゾウが帰っていった！', 'dd、決まった！'],
      // Each fix is checked on its own, so the other lines may still be there or already gone.
      done: (s) => [goal, text([milk, bread, moon, sock, eggs])].includes(text(s.lines)),
      require: ['dd'],
    },
    {
      id: 'cut-moon-sock',
      mark: 'the moon',
      text: '<code>the moon</code> と <code>a lost sock</code> の2行を1回の <code>2dd</code> で消す',
      hint: '<code>the moon</code> の行に下りて、<code>2</code> <code>d</code> <code>d</code> と押そう。',
      praise: ['買えるものだけ残った！', '2行まとめて消せたね！'],
      done: (s) => [goal, text([milk, elephant, bread, eggs])].includes(text(s.lines)),
      // "d2d" is one command as well and deletes the same lines.
      require: ['2dd', 'd2d'],
    },
  ],
});
