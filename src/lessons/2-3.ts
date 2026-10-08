import { defineLesson } from './types';

const goal = '---> Bananas are yellow and sweet.';

export default defineLesson({
  id: '2-3',
  title: 'オペレータとモーション',
  heading: 'de で単語の後ろ半分を消そう',
  lead: [
    '<code>d</code>（消す）はオペレータです。後ろにモーション（動き）を付けると、動いた分だけ消えます。',
    '<code>dw</code> 次の単語の先頭まで（空白も）／<code>de</code> 今の単語の終わりまで／<code>d$</code> 行の終わりまで',
    '<code>e</code> だけを押すと単語の終わりへ進めます。単語の途中から終わりまでは <code>de</code> で消そう。',
  ],
  fileName: 'lesson2-3.txt',
  shell: true,
  buffer: ['---> Bananas are yellowish and sweetest.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', ':'],
  // "vim" + Enter, www e hh to the "i" of "yellowish" and de (the cursor lands on the space),
  // e e hh to the last "e" of "sweetest" and de
  optimalKeys: 18,
  todos: [
    {
      id: 'cut-ish',
      mark: 'yellowish',
      text: '<code>yellowish</code> の <code>ish</code> を <code>de</code> で消す',
      hint: '<code>w</code> と <code>e</code> で <code>yellowish</code> の終わりへ進み、<code>h</code> で <code>i</code> まで戻ってから <code>de</code> を押そう。',
      praise: ['ちょうど ish だけ消えた！', 'de、決まった！'],
      // Each fix is checked on its own, so the other word may still be there or already fixed.
      done: (s) => [goal, '---> Bananas are yellow and sweetest.'].includes(s.lines[0]),
      require: ['de'],
    },
    {
      id: 'cut-est',
      mark: 'sweetest',
      text: '<code>sweetest</code> の <code>est</code> を <code>de</code> で消す',
      hint: '<code>e</code> で <code>sweetest</code> の終わりへ進み、<code>h</code> で最後の <code>e</code> まで戻ってから <code>de</code> を押そう。',
      praise: ['甘いバナナになった！', 'オペレータとモーション、ばっちり！'],
      done: (s) => [goal, '---> Bananas are yellowish and sweet.'].includes(s.lines[0]),
      require: ['de'],
    },
  ],
});
