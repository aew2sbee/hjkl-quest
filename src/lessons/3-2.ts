import { defineLesson, type Snapshot } from './types';

// Words counted from the "--->": Thr is the second, tha the sixth, und the eighth.
const word = (s: Snapshot, i: number) => s.lines[0].split(' ')[i];

export default defineLesson({
  id: '3-2',
  title: 'r で1文字置き換え',
  heading: 'r で、まちがえた1文字を置き換えよう',
  lead: [
    '<code>r</code> を押してから文字を1つ打つと、カーソルの上の文字がその文字に置き換わります。<code>ra</code> なら <code>a</code> になります。',
    '置き換えたあとはノーマルモードのままです。黄色く光っている単語のまちがいを、1文字ずつ直そう。',
  ],
  fileName: 'lesson3-2.txt',
  shell: true,
  buffer: ['---> Thr cat sat on tha mat und slept.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', ':'],
  // "vim" + Enter, 2e re (Thr's r), 4e re (tha's a), 2w ra (und's u)
  optimalKeys: 16,
  todos: [
    {
      id: 'fix-the',
      mark: 'Thr',
      text: '<code>Thr</code> を <code>The</code> にする',
      hint: '<code>e</code> で <code>Thr</code> の <code>r</code> まで進んで、<code>r</code> <code>e</code> と押そう。',
      praise: ['ぴったり置き換わった！', 'r の使い方、ばっちり！'],
      done: (s) => word(s, 1) === 'The',
      require: ['re'],
    },
    {
      id: 'fix-the-mat',
      mark: 'tha',
      text: '<code>tha</code> を <code>the</code> にする',
      hint: '<code>tha</code> の <code>a</code> まで進んで、<code>r</code> <code>e</code> と押そう。<code>4e</code> なら1回で届きます。',
      praise: ['また1文字、直った！', 'x と i を使うより速いね！'],
      done: (s) => word(s, 5) === 'the',
      require: ['re'],
    },
    {
      id: 'fix-and',
      mark: 'und',
      text: '<code>und</code> を <code>and</code> にする',
      hint: '<code>und</code> の先頭まで進んで、<code>r</code> <code>a</code> と押そう。',
      praise: ['ネコもぐっすり！', '置き換え、完璧！'],
      done: (s) => word(s, 7) === 'and',
      require: ['ra'],
    },
  ],
});
