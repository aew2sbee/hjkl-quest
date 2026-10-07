import { defineLesson } from './types';

const goals = ['---> The sun rises in the east.', '---> Most cats sleep for half of the day.'];

export default defineLesson({
  id: '1-5',
  title: 'A で追記',
  heading: 'A で行の終わりに書き足そう',
  lead: [
    'ノーマルモードで <code>A</code>（Shift と <code>a</code>）を押すと、カーソルが行のどこにあっても行末に飛んで挿入モードになります。',
    '書き足したら <code>Esc</code> でノーマルモードに戻ろう。',
  ],
  fileName: 'lesson1-5.txt',
  shell: true,
  buffer: ['---> The sun rises in the', '---> Most cats sleep for half of'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', ':'],
  // "vim" + Enter, A " east." Esc, j, A " the day." Esc
  optimalKeys: 24,
  todos: [
    {
      id: 'add-east',
      mark: 'in the',
      text: '1行目の最後に <code>east.</code> を足して、<code>Esc</code> で戻る',
      hint: '1行目のどこにいても <code>A</code> で行末に飛べます。Space と <code>east.</code> を入力して <code>Esc</code> を押そう。',
      praise: ['朝日がのぼった！', '行末までひとっ飛び！'],
      done: (s) => s.mode === 'normal' && s.lines[0] === goals[0],
    },
    {
      id: 'add-the-day',
      mark: 'half of',
      text: '2行目の最後に <code>the day.</code> を足して、<code>Esc</code> で戻る',
      hint: '<code>j</code> で2行目に下りて <code>A</code> を押し、Space と <code>the day.</code> を入力して <code>Esc</code> を押そう。',
      praise: ['ねこもぐっすり！', 'A の使い方はもう完璧！'],
      done: (s) => s.mode === 'normal' && s.lines[1] === goals[1],
    },
  ],
});
