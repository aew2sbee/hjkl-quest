import { defineLesson, type Pos, type Snapshot } from './types';

// "tr" is only ever the start of "treasure" here, so a short search finds the same places.
const map = [
  'A pirate drew a map and hid a box of gold.',
  'Look for the word that marks the spot.',
  'We walked past the old lighthouse.',
  'The first treasure was under a rock.',
  'Then we climbed over the sand dunes.',
  'A parrot laughed at us from the top of a hill.',
  'The second treasure was inside a cave.',
  'The tide came in and we got wet.',
  'We followed the footprints to the cliff.',
  'The last treasure was buried by the cliff.',
].map((line) => `---> ${line}`);

const treasure = (line: number): Pos => ({ line, ch: map[line].indexOf('treasure') });
const first = treasure(3);
const second = treasure(6);
const last = treasure(9);
const start: Pos = { line: 0, ch: 0 };

const at = (p: Pos) => (s: Snapshot) => s.cursor.line === p.line && s.cursor.ch === p.ch;

export default defineLesson({
  id: '4-2',
  title: '/ で検索',
  heading: '/ で、宝のありかを探そう',
  lead: [
    '<code>/</code> を押すと画面の下に入力欄が出ます。探したい言葉を打って Enter を押すと、次に出てくる所へ飛びます。',
    '<code>n</code> で同じ言葉の次へ、<code>N</code> で前へ進みます。<code>?</code> は後ろ向きの検索です。<code>Ctrl-O</code> を押すと、飛ぶ前にいた場所へ戻れます。',
  ],
  fileName: 'lesson4-2.txt',
  shell: true,
  buffer: map,
  start,
  // Only moving is judged here, so the text stays as it is.
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', ':'],
  // "vim" + Enter, "/tr" Enter, n, N, Ctrl-O three times (one per jump), "?" Enter (an empty search repeats the last one)
  optimalKeys: 15,
  todos: [
    {
      id: 'search',
      target: first,
      text: '<code>/treasure</code> で、1つ目の <code>treasure</code> へ移動する',
      hint: '<code>/</code> を押して <code>treasure</code> と打ち、Enter を押そう。',
      praise: ['1つ目の宝、発見！', '検索ってこんなに速いんだ！'],
      done: at(first),
      require: ['/'],
    },
    {
      id: 'next',
      target: second,
      text: '<code>n</code> で、2つ目の <code>treasure</code> へ移動する',
      hint: '<code>n</code> を押すと、さっきと同じ言葉で次を探します。',
      praise: ['2つ目もすぐ見つかった！', 'n で次へ、ばっちり！'],
      done: at(second),
      require: ['n'],
    },
    {
      id: 'previous',
      target: first,
      text: '<code>N</code> で、1つ目の <code>treasure</code> へ戻る',
      hint: 'Shift を押しながら <code>n</code> を押すと、逆向きに探します。',
      praise: ['逆向きもお手のもの！', 'N で前へ戻れた！'],
      done: at(first),
      require: ['N'],
    },
    {
      id: 'jump-back',
      target: start,
      text: '<code>Ctrl-O</code> を何回か押して、検索を始めた場所へ戻る',
      hint: 'Ctrl を押しながら <code>o</code> を押そう。押すたびに、飛ぶ前にいた場所へ1つずつ戻ります。',
      praise: ['出発点に戻ってきた！', '来た道もちゃんと覚えてるんだね！'],
      done: at(start),
      require: ['Ctrl-o'],
    },
    {
      id: 'search-backward',
      target: last,
      text: '<code>?treasure</code> で後ろ向きに探して、最後の <code>treasure</code> へ移動する',
      hint: '<code>?</code> を押して <code>treasure</code> と打ち、Enter を押そう。ファイルの先頭から後ろ向きに探すと、最後の行に回り込みます。',
      praise: ['最後の宝も手に入れた！', '検索マスターだ！'],
      done: at(last),
      require: ['?'],
    },
  ],
});
