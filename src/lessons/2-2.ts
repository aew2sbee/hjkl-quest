import { defineLesson } from './types';

const goals = ['---> Lunch starts at noon.', '---> The shop closes at six.'];

export default defineLesson({
  id: '2-2',
  title: 'd$ で行末まで削除',
  heading: 'd$ で行の残りを消そう',
  lead: [
    'ノーマルモードで <code>d</code> <code>$</code>（Shift と <code>4</code>）と押すと、カーソルの位置から行の終わりまでが消えます。',
    '消したい部分の最初の文字（ここではピリオドの後ろの空白）にカーソルを置いてから <code>d$</code> を押そう。',
  ],
  fileName: 'lesson2-2.txt',
  shell: true,
  buffer: ['---> Lunch starts at noon. xyz ignore this part', '---> The shop closes at six. and this too'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', '$', ':'],
  // "vim" + Enter, 5w to the "." and l to the space, d$ (the cursor lands on the "."),
  // j, w to the "." and l to the space, d$
  optimalKeys: 17,
  todos: [
    {
      id: 'cut-lunch',
      mark: ' xyz ignore this part',
      text: '1行目の <code>noon.</code> より後ろを <code>d$</code> で消す',
      hint: '<code>w</code> で <code>noon</code> の後ろの <code>.</code> まで進み、<code>l</code> で空白に乗ってから <code>d$</code> を押そう。',
      praise: ['行の後ろがスッキリ！', 'd$、決まった！'],
      done: (s) => s.lines[0] === goals[0],
      require: ['d$'],
    },
    {
      id: 'cut-shop',
      mark: ' and this too',
      text: '2行目の <code>six.</code> より後ろを <code>d$</code> で消す',
      hint: '<code>j</code> で2行目に下りて、<code>six.</code> の後ろの空白に乗ってから <code>d$</code> を押そう。',
      praise: ['2行ともきれいになった！', '行末まで一気に消せたね！'],
      done: (s) => s.lines[1] === goals[1],
      require: ['d$'],
    },
  ],
});
