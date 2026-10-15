import { defineLesson } from './types';

export default defineLesson({
  id: '7-1',
  title: ':help でヘルプ',
  heading: ':help で、Vim の説明書を開こう',
  lead: [
    '<code>:help</code> と打つと、ヘルプが上に開きます。<code>:help w</code> のように題名を付けると、そのコマンドの説明が開きます。',
    'ヘルプは <code>:q</code> で閉じます。本物の Vim では <code>Ctrl-W Ctrl-W</code> でヘルプとファイルを行き来できますが、ブラウザではタブを閉じる操作と重なるので、ここでは使いません。',
  ],
  fileName: 'lesson7-1.txt',
  shell: true,
  buffer: ['---> Open the help, look up the w command, then close the help again.'],
  start: { line: 0, ch: 0 },
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', 'a', 'R', 'y', ':'],
  // "vim" + Enter, ":h" Enter, ":h w" Enter, ":q" Enter (:help can be cut to :h)
  optimalKeys: 15,
  todos: [
    {
      id: 'open',
      text: '<code>:help</code> で、ヘルプを開く',
      hint: '<code>:</code> を押して <code>help</code> と打ち、Enter を押そう。',
      praise: ['説明書が開いた！', '困ったときは :help！'],
      done: (s) => s.help !== undefined,
    },
    {
      id: 'topic',
      text: '<code>:help w</code> で、<code>w</code> コマンドのヘルプを開く',
      hint: '<code>:help w</code> と打って Enter を押そう。<code>help</code> と <code>w</code> のあいだは Space を1つ空けます。',
      praise: ['w の説明が読めた！', '題名で引けるんだね！'],
      done: (s) => s.help === 'w',
    },
    {
      id: 'close',
      text: '<code>:q</code> で、ヘルプを閉じる',
      hint: '<code>:q</code> と打って Enter を押そう。ヘルプが開いているときは、Vim は終わらずにヘルプだけが閉じます。',
      praise: ['すっきり閉じた！', 'ヘルプの使い方、ばっちり！'],
      // Also true before the help is opened, but only counts once the TODOs before it are done.
      done: (s) => s.help === undefined,
    },
  ],
});
