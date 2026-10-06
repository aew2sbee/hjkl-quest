import { defineLesson, type Pos, type Snapshot } from './types';

// Targets in the order the TODOs visit them. Together they need all of h, j, k and l.
const right: Pos = { line: 2, ch: 7 };
const left: Pos = { line: 4, ch: 1 };
const top: Pos = { line: 0, ch: 4 };

const at = (p: Pos) => (s: Snapshot) => s.cursor.line === p.line && s.cursor.ch === p.ch;

// Same color as the highlighted target in the editor, so the text and the map match.
const star = '<code class="star">*</code>';

export default defineLesson({
  id: '1-1',
  title: 'カーソルの移動',
  heading: 'h j k l でカーソルを動かそう',
  lead: [
    'Vim では矢印キーやマウスを使わず、<code>h</code> <code>j</code> <code>k</code> <code>l</code> でカーソルを動かします。',
    '<code>h</code> は左、<code>j</code> は下、<code>k</code> は上、<code>l</code> は右です。',
    `黄色く光っている ${star} を目指そう。`,
  ],
  fileName: 'lesson1-1.txt',
  // Launching Vim is taught in 1.2.
  shell: false,
  buffer: [
    '....*....',
    '.........',
    '.......*.',
    '.........',
    '.*.......',
  ],
  start: { line: 0, ch: 0 },
  readOnly: true,
  keys: ['h', 'j', 'k', 'l'],
  // right: 2j + 7l, left: 2j + 6h, top: 4k + 3l
  optimalKeys: 24,
  todos: [
    {
      id: 'reach-right',
      text: `<code>j</code> と <code>l</code> で右下の ${star} に乗る`,
      hint: '<code>j</code> で2行下りてから、<code>l</code> で右へ7つ進もう。',
      praise: ['ナイス移動！', 'j と l を使いこなしてる！'],
      done: at(right),
      target: right,
    },
    {
      id: 'reach-left',
      text: `<code>j</code> と <code>h</code> で左下の ${star} に乗る`,
      hint: '<code>j</code> で2行下りてから、<code>h</code> で左へ6つ戻ろう。',
      praise: ['いい感じ！', 'h もばっちり！'],
      done: at(left),
      target: left,
    },
    {
      id: 'reach-top',
      text: `<code>k</code> と <code>l</code> で一番上の ${star} に乗る`,
      hint: '<code>k</code> で4行上がってから、<code>l</code> で右へ3つ進もう。',
      praise: ['hjkl を全部使えた！', 'もう矢印キーはいらないね！'],
      done: at(top),
      target: top,
    },
  ],
});
