import { defineLesson, type Snapshot } from './types';

// Words counted from the "--->": the room is the third, the floor the seventh (with its ".").
const word = (s: Snapshot, i: number) => s.lines[0].split(' ')[i];
const fixed = (i: number, w: string) => (s: Snapshot) => s.mode === 'normal' && word(s, i) === w;

export default defineLesson({
  id: '6-3',
  title: 'R で上書き',
  heading: 'R で、xxx を数字に上書きしよう',
  lead: [
    '<code>R</code>（Shift と <code>r</code>）を押すと置換モードになり、打った文字がカーソルの文字を1つずつ上書きします。',
    '<code>r</code> は1文字だけですが、<code>R</code> は <code>Esc</code> を押すまで何文字でも上書きできます。',
  ],
  fileName: 'lesson6-3.txt',
  shell: true,
  buffer: ['---> Room xxx is on floor xx.'],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', 'a', 'R', ':'],
  // "vim" + Enter, 2w R "304" Esc, 4w R "12" Esc
  optimalKeys: 17,
  todos: [
    {
      id: 'fix-room',
      mark: 'xxx',
      text: '<code>xxx</code> を <code>R</code> で <code>304</code> にする',
      hint: '<code>xxx</code> の先頭で <code>R</code> を押し、<code>304</code> と打って <code>Esc</code> を押そう。',
      praise: ['304 号室、見つけた！', 'R で上書きできた！'],
      done: fixed(2, '304'),
      require: ['R'],
    },
    {
      id: 'fix-floor',
      mark: 'xx',
      text: '<code>xx</code> を <code>R</code> で <code>12</code> にする',
      hint: '<code>xx</code> の先頭で <code>R</code> を押し、<code>12</code> と打って <code>Esc</code> を押そう。',
      praise: ['12 階に到着！', '上書き、完璧！'],
      done: fixed(6, '12.'),
      require: ['R'],
    },
  ],
});
