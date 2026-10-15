import { defineLesson, type Snapshot } from './types';

const ran = (command: RegExp) => (s: Snapshot) => command.test(s.commands.at(-1) ?? '');

export default defineLesson({
  id: '5-1',
  title: ':! で外部コマンド',
  heading: ':! で、Vim からシェルのコマンドを使おう',
  lead: [
    '<code>:!</code> のあとにシェルのコマンドを打って Enter を押すと、Vim を出ずにそのコマンドを実行できます。',
    '<code>:!ls</code> でファイルの一覧が出ます。<code>:!cat todo.txt</code> のように、コマンドにはファイル名などを付けられます。',
  ],
  fileName: 'lesson5-1.txt',
  shell: true,
  buffer: ['---> There are some other files next to this one.', '---> List them, then read the one with the to-do list.'],
  files: {
    'notes.txt': ['Remember to buy milk.'],
    'todo.txt': ['1. Run :!ls', '2. Run :!cat todo.txt', '3. Have a cup of tea'],
  },
  start: { line: 0, ch: 0 },
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', ':'],
  // "vim" + Enter, ":!ls" Enter, ":!cat todo.txt" Enter
  optimalKeys: 24,
  todos: [
    {
      id: 'list',
      text: '<code>:!ls</code> で、ファイルの一覧を出す',
      hint: '<code>:</code> を押して <code>!ls</code> と打ち、Enter を押そう。一覧はエディタの下に出ます。',
      praise: ['ファイルが3つ見えた！', 'Vim から ls できた！'],
      done: ran(/^:!\s*ls\s*$/),
    },
    {
      id: 'read',
      text: '<code>:!cat todo.txt</code> で、<code>todo.txt</code> の中身を出す',
      hint: '<code>:</code> を押して <code>!cat todo.txt</code> と打ち、Enter を押そう。<code>cat</code> と <code>todo.txt</code> のあいだは Space を1つ空けます。',
      praise: ['やることリスト、読めた！', '引数を付けるのもばっちり！'],
      done: ran(/^:!\s*cat\s+todo\.txt\s*$/),
    },
  ],
});
