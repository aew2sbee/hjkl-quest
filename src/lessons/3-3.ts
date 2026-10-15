import { defineLesson, type Snapshot } from './types';

// Words counted from the "--->": xqzt is the fourth, bxlk the eighth.
const word = (s: Snapshot, i: number) => s.lines[0].split(' ')[i];

export default defineLesson({
  id: '3-3',
  title: 'ce で単語を変更',
  heading: 'ce で、でたらめな単語を書き直そう',
  lead: [
    '<code>ce</code> は、カーソルから単語の終わりまでを消して、そのまま挿入モードに入ります。<code>c</code> は変更（change）のオペレータで、<code>de</code> と <code>i</code> を一度にしたのと同じです。',
    '正しい単語を打ったら <code>Esc</code> でノーマルモードに戻ろう。',
  ],
  fileName: 'lesson3-3.txt',
  shell: true,
  buffer: ['---> My favorite xqzt is a red bxlk with fast wheels.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', ':'],
  // "vim" + Enter, 3w ce "toy" Esc, 4w l ce "ike" Esc
  optimalKeys: 21,
  todos: [
    {
      id: 'change-toy',
      mark: 'xqzt',
      text: '<code>xqzt</code> を <code>ce</code> で <code>toy</code> にする',
      hint: '<code>xqzt</code> の先頭で <code>c</code> <code>e</code> と押し、<code>toy</code> と打って <code>Esc</code> を押そう。',
      praise: ['おもちゃが戻ってきた！', 'ce、決まった！'],
      done: (s) => s.mode === 'normal' && word(s, 3) === 'toy',
      require: ['ce'],
    },
    {
      id: 'change-bike',
      mark: 'bxlk',
      text: '<code>bxlk</code> を <code>ce</code> で <code>bike</code> にする',
      hint: '<code>b</code> は合っているので、<code>x</code> の上で <code>ce</code> と押して <code>ike</code> と打ってもいいよ。',
      praise: ['速そうな自転車！', '消して打つのが1回で済んだね！'],
      done: (s) => s.mode === 'normal' && word(s, 7) === 'bike',
      require: ['ce'],
    },
  ],
});
