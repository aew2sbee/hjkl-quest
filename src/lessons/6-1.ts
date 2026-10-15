import { defineLesson, type Snapshot } from './types';

// No "--->" here: the learner types whole new lines, and should not have to type arrows too.
const monday = 'Monday: wash the car';
const tuesday = 'Tuesday: buy milk';
const wednesday = 'Wednesday: clean the room';
const title = 'My plan:';

const follows = (s: Snapshot, lines: string[]) => s.lines.join('\n').includes(lines.join('\n'));

export default defineLesson({
  id: '6-1',
  title: 'o と O で行を開く',
  heading: 'o と O で、予定の行を書き足そう',
  lead: [
    '<code>o</code> はカーソルの行の下に新しい行を作り、挿入モードに入ります。<code>O</code>（Shift と <code>o</code>）は上に作ります。',
    '打ち終わったら <code>Esc</code> でノーマルモードに戻ろう。',
  ],
  fileName: 'lesson6-1.txt',
  shell: true,
  buffer: [monday, wednesday],
  start: { line: 0, ch: 0 },
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', ':'],
  // "vim" + Enter, o "Tuesday: buy milk" Esc, k O "My plan:" Esc
  optimalKeys: 34,
  todos: [
    {
      id: 'open-below',
      mark: monday,
      text: '<code>Monday</code> の行の下に、<code>o</code> で <code>Tuesday: buy milk</code> の行を足す',
      hint: '<code>Monday</code> の行で <code>o</code> を押し、<code>Tuesday: buy milk</code> と打って <code>Esc</code> を押そう。',
      praise: ['火曜日の予定が入った！', 'o で行を開けたね！'],
      done: (s) => s.mode === 'normal' && follows(s, [monday, tuesday, wednesday]),
      require: ['o'],
    },
    {
      id: 'open-above',
      mark: monday,
      text: '一番上に、<code>O</code> で <code>My plan:</code> の行を足す',
      hint: '<code>Monday</code> の行に戻って <code>O</code>（Shift と <code>o</code>）を押し、<code>My plan:</code> と打って <code>Esc</code> を押そう。',
      praise: ['見出しまで付いた！', 'O で上にも開けた！'],
      done: (s) => s.mode === 'normal' && follows(s, [title, monday]) && s.lines[0] === title,
      require: ['O'],
    },
  ],
});
