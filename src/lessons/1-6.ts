import { defineLesson } from './types';

const goal = '---> Remember to buy milk.';

export default defineLesson({
  id: '1-6',
  title: '保存して終了',
  heading: 'ファイルを開いて直し、:wq で保存しよう',
  lead: [
    'シェルで <code>vim ファイル名</code> と入力すると、そのファイルを開けます。',
    '直したら <code>:wq</code> と入力して Enter。<code>w</code> は保存（write）、<code>q</code> は終了（quit）です。',
  ],
  fileName: 'notes.txt',
  shell: true,
  saves: true,
  buffer: ['---> Remember to buyy milk.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', ':'],
  // "vim notes.txt" + Enter, 19l x, ":wq" + Enter
  optimalKeys: 38,
  todos: [
    {
      id: 'open',
      text: 'シェルで <code>vim notes.txt</code> と入力して Enter を押し、ファイルを開く',
      hint: '<code>vim</code> のあとに Space を1つ空けて、ファイル名 <code>notes.txt</code> まで入力してから Enter を押そう。',
      praise: ['ファイルを開けた！', 'ファイル名で開くのもばっちり！'],
      done: (s) => s.ran.includes('vim'),
    },
    {
      id: 'fix-buy',
      mark: 'buyy',
      text: '<code>buyy</code> を <code>buy</code> にする',
      hint: '<code>l</code> で <code>y</code> の上まで進んで、<code>x</code> を1回押そう。',
      praise: ['きれいに直った！', 'x もまだ覚えてるね！'],
      done: (s) => s.lines[0] === goal,
    },
    {
      id: 'save',
      text: '<code>:wq</code> と入力して Enter を押し、保存してシェルに戻る',
      hint: '<code>:</code> を押して画面の下に入力欄を出し、<code>wq</code> と入力して Enter を押そう。',
      praise: ['保存できた！ これで Vim の基本はばっちり！', 'Chapter 1 制覇！'],
      // The editor keeps the text after quitting, so these are the lines just written.
      done: (s) => s.screen === 'shell' && s.ran[s.ran.length - 1] === ':wq' && s.lines[0] === goal,
    },
  ],
});
