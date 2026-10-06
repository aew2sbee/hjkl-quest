import { defineLesson } from './types';

const goal = '---> I drink a cup of tea every morning.';

export default defineLesson({
  id: '1-4',
  title: 'i で挿入',
  heading: 'i で足りない単語を入れよう',
  lead: [
    'ノーマルモードで <code>i</code> を押すと挿入モードになり、カーソルの前に文字を入れられます。',
    '入れたい場所の次の文字にカーソルを置いてから <code>i</code> を押し、入れ終わったら <code>Esc</code> でノーマルモードに戻ろう。',
  ],
  fileName: 'lesson1-4.txt',
  shell: true,
  buffer: ['---> I a cup tea every morning.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', ':'],
  // "vim" + Enter, then l x7, i "drink " Esc (the cursor lands on the space after "drink"),
  // then l x6 to the space before "tea", i " of" Esc
  optimalKeys: 30,
  todos: [
    {
      id: 'add-drink',
      mark: 'a cup',
      text: '<code>a cup</code> の前に <code>drink</code> を足して、<code>Esc</code> で戻る',
      hint: '<code>l</code> で <code>a</code> の上まで進み、<code>i</code> を押して <code>drink</code> と Space を入力、最後に <code>Esc</code> を押そう。',
      praise: ['ちゃんと入った！', '挿入モードを使いこなしてる！'],
      done: (s) => s.mode === 'normal' && s.lines[0].includes(' I drink a cup '),
    },
    {
      id: 'add-of',
      mark: 'tea',
      text: '<code>tea</code> の前に <code>of</code> を足して、<code>Esc</code> で戻る',
      hint: '<code>l</code> で <code>tea</code> の前の Space の上まで進み、<code>i</code> を押して Space と <code>of</code> を入力、最後に <code>Esc</code> を押そう。',
      praise: ['おいしそうな文になった！', 'もう i はばっちり！'],
      done: (s) => s.mode === 'normal' && s.lines[0] === goal,
    },
  ],
});
