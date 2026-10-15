import { defineLesson, type Snapshot } from './types';

const vimrc = '~/.vimrc';
const line = 'set number';

const inVimrc = (s: Snapshot) => s.file === vimrc;

export default defineLesson({
  id: '7-2',
  title: 'vimrc で設定',
  heading: '~/.vimrc に、自分の設定を書こう',
  lead: [
    '<code>~/.vimrc</code> は、Vim を起動するたびに読み込まれる設定ファイルです。<code>:set</code> で毎回打つ設定を書いておけます。',
    '<code>:e ファイル名</code> で、ほかのファイルを開けます。設定を1行書いたら <code>:w</code> で保存しよう。',
  ],
  fileName: 'lesson7-2.txt',
  shell: true,
  buffer: ['---> Open your settings file and add a line to it.'],
  files: { [vimrc]: ['" My Vim settings'] },
  start: { line: 0, ch: 0 },
  // The settings file opens in this editor too, so it has to take changes.
  readOnly: false,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', 'a', 'R', 'y', ':'],
  // "vim" + Enter, ":e ~/.vimrc" Enter, o "set number" Esc, ":w" Enter
  optimalKeys: 31,
  todos: [
    {
      id: 'open',
      text: '<code>:e ~/.vimrc</code> で、設定ファイルを開く',
      hint: '<code>:</code> を押して <code>e ~/.vimrc</code> と打ち、Enter を押そう。<code>~</code> はホームディレクトリのことです。',
      praise: ['設定ファイルが開いた！', ':e でほかのファイルも開けるね！'],
      done: inVimrc,
    },
    {
      id: 'write-line',
      text: '<code>set number</code> の行を書き足す',
      hint: '<code>o</code> で下に行を開いて <code>set number</code> と打ち、<code>Esc</code> を押そう。',
      praise: ['設定を1行書けた！', '行番号を出す設定だよ！'],
      done: (s) => inVimrc(s) && s.mode === 'normal' && s.lines.includes(line),
    },
    {
      id: 'save',
      text: '<code>:w</code> で保存する',
      hint: '<code>:w</code> と打って Enter を押そう。ファイル名を付けないと、開いているファイルに保存します。',
      praise: ['次の起動から効く設定になった！', 'vimrc デビュー！'],
      done: (s) => s.files[vimrc]?.includes(line) ?? false,
    },
  ],
});
