import { defineLesson, type Snapshot } from './types';

const buffer = [
  '---> Here is what to buy this weekend:',
  '---> apples',
  '---> bread',
  '---> cheese',
  '---> That is all for now.',
];
const part = 'part.txt';
const list = buffer.slice(1, 4);

const selectsList = (s: Snapshot) =>
  s.mode === 'visual' && Math.min(s.anchor.line, s.cursor.line) === 1 && Math.max(s.anchor.line, s.cursor.line) === 3;

export default defineLesson({
  id: '5-3',
  title: '選んだ行だけ保存',
  heading: 'v で選んで、その行だけを保存しよう',
  lead: [
    '<code>v</code> を押すとビジュアルモードになり、カーソルを動かした所まで選択が広がります。',
    '選んだまま <code>:</code> を押すと、下に <code>:\'&lt;,\'&gt;</code> と出ます。これは「選んだ行」という意味です。続けて <code>w part.txt</code> と打つと、選んだ行だけを保存できます。',
  ],
  fileName: 'lesson5-3.txt',
  shell: true,
  buffer,
  files: {},
  start: { line: 0, ch: 0 },
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', ':'],
  // "vim" + Enter, j v j j, ":" (Vim fills in '<,'>) "w part.txt" Enter
  optimalKeys: 20,
  todos: [
    {
      id: 'select',
      mark: 'apples',
      text: '<code>v</code> で、<code>apples</code> から <code>cheese</code> までの3行を選ぶ',
      hint: '<code>apples</code> の行に下りて <code>v</code> を押し、<code>j</code> で <code>cheese</code> の行まで下りよう。',
      praise: ['3行、選べた！', 'ビジュアルモード、デビュー！'],
      done: selectsList,
    },
    {
      id: 'write',
      text: '<code>:\'&lt;,\'&gt;w part.txt</code> で、選んだ行を <code>part.txt</code> に保存する',
      hint: '選んだまま <code>:</code> を押すと <code>:\'&lt;,\'&gt;</code> が出るので、そのあとに <code>w part.txt</code> と打って Enter を押そう。',
      praise: ['選んだ所だけ保存できた！', 'part.txt は次のレッスンで使うよ！'],
      done: (s) => s.files[part]?.join('\n') === list.join('\n'),
      require: [":'<,'>w part.txt", /^:'<,'>w\s/],
    },
  ],
});
