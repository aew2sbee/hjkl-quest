import { defineLesson } from './types';

const readme = 'readme-for-learners.txt';

export default defineLesson({
  id: '7-3',
  title: 'Tab で補完',
  heading: 'Ctrl-D と Tab で、コマンドラインを補完しよう',
  lead: [
    '<code>:</code> のあとでコマンドの頭を打って <code>Ctrl-D</code>（Ctrl と <code>d</code>）を押すと、続きの候補が一覧で出ます。',
    '<code>Tab</code> を押すと、候補が1つ入ります。もう一度押すと次の候補です。長いファイル名も、頭の数文字と <code>Tab</code> で打てます。',
  ],
  fileName: 'lesson7-3.txt',
  shell: true,
  buffer: ['---> There is a file with a long name next to this one. Open it without typing it all.'],
  files: {
    [readme]: ['---> You opened me with Tab. Well done!', '---> That is the end of the tutor. Happy Vimming!'],
  },
  start: { line: 0, ch: 0 },
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', 'a', 'R', 'y', 'Ctrl-d', 'Tab', ':'],
  // "vim" + Enter, ":e" Ctrl-D, "d" Tab (:edit), " r" Tab Enter
  optimalKeys: 13,
  todos: [
    {
      id: 'list',
      text: '<code>:e</code> と打って <code>Ctrl-D</code> を押し、<code>e</code> で始まるコマンドの一覧を出す',
      hint: '<code>:</code> を押して <code>e</code> と打ち、Ctrl を押しながら <code>d</code> を押そう。Enter はまだ押しません。',
      praise: ['候補がずらり！', 'e で始まるコマンド、こんなにあるんだ！'],
      done: (s) => s.ran.includes('<C-D>:e'),
    },
    {
      id: 'command',
      text: '続けて <code>d</code> と打って <code>Tab</code> を押し、<code>:edit</code> にする',
      hint: '<code>:e</code> のあとに <code>d</code> を打って <code>Tab</code> を押そう。<code>ed</code> で始まるコマンドは <code>edit</code> だけです。',
      praise: ['コマンド名が完成！', 'Tab って便利！'],
      done: (s) => s.ran.includes('<Tab>:edit'),
    },
    {
      id: 'file',
      text: '<code>Tab</code> でファイル名を補完して、<code>readme-for-learners.txt</code> を開く',
      hint: 'Space を打ってから <code>r</code> を打ち、<code>Tab</code> を押そう。ファイル名が入ったら Enter です。',
      praise: ['長い名前も一瞬！', 'これで vimtutor 全レッスン制覇！ おめでとう！'],
      done: (s) => s.file === readme && s.ran.some((entry) => entry.startsWith('<Tab>:') && entry.endsWith(` ${readme}`)),
    },
  ],
});
