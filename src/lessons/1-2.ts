import { defineLesson } from './types';

export default defineLesson({
  id: '1-2',
  title: '起動と終了',
  heading: 'Vim を起動して、:q! で終了しよう',
  lead: [
    'シェルで <code>vim</code> と入力して Enter を押すと、Vim が起動します。',
    'Vim を終了するには、<code>:q!</code> と入力して Enter を押します。',
    '<code>:q!</code> は、変更を保存せずに終了するコマンドです。',
  ],
  fileName: 'lesson1-2.txt',
  shell: true,
  buffer: [
    'Welcome! You are inside Vim now.',
    '',
    'To leave without saving, type  :q!  and press Enter.',
  ],
  start: { line: 0, ch: 0 },
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', ':'],
  // "vim" + Enter, ":q!" + Enter
  optimalKeys: 8,
  todos: [
    {
      id: 'launch',
      text: 'シェルで <code>vim</code> と入力して Enter を押し、Vim を起動する',
      hint: '<code>v</code> <code>i</code> <code>m</code> の3文字を入力してから Enter を押そう。',
      praise: ['Vim を起動できた！', 'ようこそ Vim の世界へ！'],
      done: (s) => s.ran.includes('vim'),
    },
    {
      id: 'quit',
      text: '<code>:q!</code> と入力して Enter を押し、シェルに戻る',
      hint: '<code>:</code> を押すと画面の下に入力欄が出ます。続けて <code>q!</code> と入力して Enter を押そう。',
      praise: ['ちゃんと抜け出せた！', 'もう Vim から出られなくなることはないね！'],
      done: (s) => s.screen === 'shell' && s.ran.includes(':q!'),
    },
  ],
});
