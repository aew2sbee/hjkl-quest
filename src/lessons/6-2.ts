import { defineLesson, type Snapshot } from './types';

// Words counted from the "--->": lik is the third, pla the fifth, gard the eighth (with its ".").
const word = (s: Snapshot, i: number) => s.lines[0].split(' ')[i];
const fixed = (i: number, w: string) => (s: Snapshot) => s.mode === 'normal' && word(s, i) === w;

export default defineLesson({
  id: '6-2',
  title: 'a で後ろに追加',
  heading: 'a で、単語の終わりに文字を足そう',
  lead: [
    '<code>a</code> はカーソルの文字の後ろから挿入モードに入ります。<code>i</code> は前、<code>a</code> は後ろです。',
    '<code>e</code> で単語の終わりへ進んでから <code>a</code> を押すと、単語の続きを打てます。',
  ],
  fileName: 'lesson6-2.txt',
  shell: true,
  buffer: ['---> We lik to pla in the gard.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', 'a', ':'],
  // "vim" + Enter, 3e a "e" Esc, 2e a "y" Esc, 3e a "en" Esc
  optimalKeys: 20,
  todos: [
    {
      id: 'fix-like',
      mark: 'lik',
      text: '<code>lik</code> を <code>like</code> にする',
      hint: '<code>e</code> で <code>lik</code> の終わりへ進んで <code>a</code> を押し、<code>e</code> と打って <code>Esc</code> を押そう。',
      praise: ['好きになれた！', 'a で後ろに足せたね！'],
      done: fixed(2, 'like'),
      require: ['a'],
    },
    {
      id: 'fix-play',
      mark: 'pla',
      text: '<code>pla</code> を <code>play</code> にする',
      hint: '<code>pla</code> の終わりで <code>a</code> を押し、<code>y</code> と打とう。',
      praise: ['遊びに行ける！', 'e と a の組み合わせ、ばっちり！'],
      done: fixed(4, 'play'),
      require: ['a'],
    },
    {
      id: 'fix-garden',
      mark: 'gard',
      text: '<code>gard</code> を <code>garden</code> にする',
      hint: '<code>gard</code> の <code>d</code> の上で <code>a</code> を押し、<code>en</code> と打とう。',
      praise: ['お庭が完成！', '追加の達人！'],
      done: fixed(7, 'garden.'),
      require: ['a'],
    },
  ],
});
