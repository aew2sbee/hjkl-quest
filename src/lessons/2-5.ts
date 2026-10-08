import { defineLesson } from './types';

const goal = '---> I really like green apples.';

export default defineLesson({
  id: '2-5',
  title: 'カウント付きの削除',
  heading: 'd2w で単語をまとめて消そう',
  lead: [
    'オペレータとモーションのあいだに数字を入れると、その数だけまとめて消せます。<code>d2w</code> は2単語、<code>d3w</code> は3単語です。',
    '消したい最初の単語の先頭にカーソルを置いてから、1回のコマンドで消そう。',
  ],
  fileName: 'lesson2-5.txt',
  shell: true,
  buffer: ['---> I ONE TWO really like A B C green apples.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':'],
  // "vim" + Enter, 2w to "ONE" and d2w (the cursor lands on "really"), 2w to "A" and d3w
  optimalKeys: 14,
  todos: [
    {
      id: 'cut-one-two',
      mark: 'ONE TWO',
      text: '<code>ONE TWO</code> を1回の <code>d2w</code> で消す',
      hint: '<code>2w</code> で <code>ONE</code> の先頭へ進んで、<code>d</code> <code>2</code> <code>w</code> と押そう。',
      praise: ['2単語まとめて消えた！', 'd2w、決まった！'],
      // Each fix is checked on its own, so the other words may still be there or already gone.
      done: (s) => [goal, '---> I really like A B C green apples.'].includes(s.lines[0]),
      // "2dw" is one command as well and deletes the same words.
      require: ['d2w', '2dw'],
    },
    {
      id: 'cut-a-b-c',
      mark: 'A B C',
      text: '<code>A B C</code> を1回の <code>d3w</code> で消す',
      hint: '<code>2w</code> で <code>A</code> の先頭へ進んで、<code>d</code> <code>3</code> <code>w</code> と押そう。',
      praise: ['すっきりした文になった！', '数字付きの削除もばっちり！'],
      done: (s) => [goal, '---> I ONE TWO really like green apples.'].includes(s.lines[0]),
      require: ['d3w', '3dw'],
    },
  ],
});
