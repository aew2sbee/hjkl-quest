import { defineLesson } from './types';

const weather = '---> The weather today is warm and sunny.';
const train = '---> Our train leaves from platform two.';

export default defineLesson({
  id: '3-4',
  title: 'c$ で行末まで変更',
  heading: 'c$ で、行の後ろ半分を書き直そう',
  lead: [
    '<code>c</code> も <code>d</code> と同じモーションを使えます。<code>c$</code> はカーソルから行の終わりまでを消して、挿入モードに入ります。',
    '光っている部分の先頭で <code>c$</code> を押し、正しい文を打って <code>Esc</code> を押そう。',
  ],
  fileName: 'lesson3-4.txt',
  shell: true,
  buffer: ['---> The weather today is cold and rainy all day long.', '---> Our train leaves from platform nine or maybe ten.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', ':'],
  // "vim" + Enter, 5w c$ "warm and sunny." Esc (the cursor stays on the "."), j 4h c$ "two." Esc
  optimalKeys: 34,
  todos: [
    {
      id: 'change-weather',
      mark: 'cold and rainy all day long.',
      text: '1行目の <code>cold</code> から後ろを <code>c$</code> で <code>warm and sunny.</code> にする',
      hint: '<code>w</code> で <code>cold</code> の先頭へ進んで <code>c$</code> と押し、<code>warm and sunny.</code> と打って <code>Esc</code> を押そう。',
      praise: ['いい天気になった！', 'c$、決まった！'],
      done: (s) => s.mode === 'normal' && s.lines[0] === weather,
      require: ['c$'],
    },
    {
      id: 'change-train',
      mark: 'nine or maybe ten.',
      text: '2行目の <code>nine</code> から後ろを <code>c$</code> で <code>two.</code> にする',
      hint: '<code>nine</code> の先頭へ移って <code>c$</code> と押し、<code>two.</code> と打って <code>Esc</code> を押そう。',
      praise: ['乗り場がはっきりした！', '行末までの書き直し、完璧！'],
      done: (s) => s.mode === 'normal' && s.lines[1] === train,
      require: ['c$'],
    },
  ],
});
