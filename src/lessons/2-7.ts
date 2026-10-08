import { defineLesson, type Snapshot } from './types';

const start = '---> Thiss linee hass extraa letterss.';
const goal = '---> This line has extra letters.';

const last = (s: Snapshot) => s.commands.at(-1);

export default defineLesson({
  id: '2-7',
  title: '取り消しとやり直し',
  heading: 'u で取り消し、Ctrl-R でやり直そう',
  lead: [
    '<code>u</code> は最後の変更を1つ取り消します。<code>U</code>（Shift と <code>u</code>）は、直した行をまるごと最初の形に戻します。',
    '<code>Ctrl-R</code>（Ctrl と <code>r</code>）は、<code>u</code> で取り消した変更をやり直します。今回は直すだけでなく、戻したり進めたりしてみよう。',
  ],
  fileName: 'lesson2-7.txt',
  shell: true,
  buffer: [start],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', ':'],
  // "vim" + Enter, e e x and then e x four times (each word's last letter), U, u, u five times, Ctrl-R five times
  optimalKeys: 27,
  // Each later TODO names the command that must have made the change, since the same lines come back again and again.
  todos: [
    {
      id: 'fix',
      text: '<code>x</code> で余計な文字を全部消す',
      hint: '余計な文字はどれも単語の最後にあります。<code>e</code> で単語の終わりへ進んで <code>x</code> を押そう。',
      praise: ['きれいな文になった！', 'まずは直せたね！'],
      done: (s) => s.lines[0] === goal,
    },
    {
      id: 'undo-line',
      text: '<code>U</code> で行を最初の形に戻す',
      hint: 'Shift を押しながら <code>u</code> を押すと、直した行がまるごと最初に戻ります。',
      praise: ['一瞬で元どおり！', 'U は行ごと戻せるんだね！'],
      done: (s) => s.lines[0] === start && last(s) === 'U',
    },
    {
      id: 'undo-undo-line',
      text: '<code>u</code> で <code>U</code> を取り消して、直した行に戻す',
      hint: '<code>U</code> も1つの変更なので、<code>u</code> を1回押すと取り消せます。',
      praise: ['取り消しの取り消し！', 'U も u で取り消せた！'],
      done: (s) => s.lines[0] === goal && last(s) === 'u',
    },
    {
      id: 'undo-all',
      text: '<code>u</code> を何回か押して、最初の行まで戻す',
      hint: '<code>u</code> を1回押すたびに、<code>x</code> で消した文字が1つ戻ります。',
      praise: ['全部取り消せた！', 'u で1つずつ戻れるね！'],
      done: (s) => s.lines[0] === start && last(s) === 'u',
    },
    {
      id: 'redo-all',
      text: '<code>Ctrl-R</code> を何回か押して、直した行まで進める',
      hint: 'Ctrl を押しながら <code>r</code> を押すと、取り消した変更が1つずつ戻ってきます。',
      praise: ['やり直しも完璧！', 'これで Chapter 2 制覇！'],
      done: (s) => s.lines[0] === goal && last(s) === 'Ctrl-r',
    },
  ],
});
