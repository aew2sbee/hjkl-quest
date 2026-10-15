import { defineLesson, type Snapshot } from './types';

const backup = 'backup.txt';
const hasBackup = (s: Snapshot) => backup in s.files;

export default defineLesson({
  id: '5-2',
  title: ':w で名前を付けて保存',
  heading: ':w ファイル名 で、コピーを保存しよう',
  lead: [
    '<code>:w</code> のあとに Space とファイル名を打つと、今の内容をその名前のファイルに保存します。元のファイルはそのままです。',
    '保存できたら <code>:!ls</code> で確かめて、いらなくなったら <code>:!rm ファイル名</code> で消しましょう。',
  ],
  fileName: 'lesson5-2.txt',
  shell: true,
  buffer: ['---> Keep a copy of this file before you change it.'],
  // No other files yet: the one to make is the backup.
  files: {},
  start: { line: 0, ch: 0 },
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', ':'],
  // "vim" + Enter, ":w backup.txt" Enter, ":!ls" Enter, ":!rm backup.txt" Enter
  optimalKeys: 39,
  todos: [
    {
      id: 'write',
      text: '<code>:w backup.txt</code> で、今のファイルを <code>backup.txt</code> として保存する',
      hint: '<code>:</code> を押して <code>w backup.txt</code> と打ち、Enter を押そう。<code>w</code> とファイル名のあいだは Space を1つ空けます。',
      praise: ['コピーができた！', 'これで安心して書き換えられるね！'],
      done: hasBackup,
    },
    {
      id: 'list',
      text: '<code>:!ls</code> で、<code>backup.txt</code> ができたことを確かめる',
      hint: '<code>:!ls</code> と打って Enter を押そう。<code>backup.txt</code> が一覧に出るはずです。',
      praise: ['ちゃんとできてる！', '確かめるのは大事！'],
      done: (s) => hasBackup(s) && /^:!\s*ls\s*$/.test(s.commands.at(-1) ?? ''),
    },
    {
      id: 'remove',
      text: '<code>:!rm backup.txt</code> で、<code>backup.txt</code> を消す',
      hint: '<code>:!rm backup.txt</code> と打って Enter を押そう。',
      praise: ['お片付けまで完璧！', 'ファイル操作、ばっちり！'],
      // Also true before the backup is made, but only counts once the TODOs before it are done.
      done: (s) => !hasBackup(s),
    },
  ],
});
