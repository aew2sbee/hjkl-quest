import { defineLesson, type Pos, type Snapshot } from './types';

const buffer = [
  '---> I started to learn Vim this week.',
  '---> The command to start it is vim.',
  '---> My friend writes VIM in capitals.',
  '---> Now I can use vim every day.',
];

// Without 'ignorecase' a search for vim skips the Vim before it. With it, n goes on to VIM.
const lower: Pos = { line: 1, ch: buffer[1].indexOf('vim') };
const capitals: Pos = { line: 2, ch: buffer[2].indexOf('VIM') };

const at = (p: Pos) => (s: Snapshot) => s.cursor.line === p.line && s.cursor.ch === p.ch;

export default defineLesson({
  id: '6-5',
  title: ':set で設定',
  heading: ':set で、検索のしかたを変えよう',
  lead: [
    '<code>:set</code> で Vim の設定（オプション）を変えられます。最初は、検索は大文字と小文字を区別し、見つかった所は光りません。',
    '<code>:set ic</code>（ignorecase）で区別しなくなり、<code>:set hls is</code>（hlsearch と incsearch）で見つかった所が光ります。<code>no</code> を付けると元に戻ります。',
  ],
  fileName: 'lesson6-5.txt',
  shell: true,
  buffer,
  start: { line: 0, ch: 0 },
  // Only moving and settings are judged here, so the text stays as it is.
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', 'v', 'o', 'O', 'a', 'R', 'y', ':'],
  // "vim" + Enter, "/v" Enter, ":se ic" Enter, n, ":se hls is" Enter, ":se noic" Enter
  optimalKeys: 35,
  todos: [
    {
      id: 'search-case',
      target: lower,
      text: '<code>/vim</code> で検索して、小文字の <code>vim</code> だけが見つかることを確かめる',
      hint: '<code>/vim</code> と打って Enter を押そう。1行目の <code>Vim</code> は大文字が入っているので飛ばされます。',
      praise: ['小文字だけ見つかった！', '大文字と小文字は別物なんだね！'],
      done: at(lower),
      require: ['/'],
    },
    {
      id: 'ignore-case',
      target: capitals,
      text: '<code>:set ic</code> で大文字と小文字を区別しない設定にして、<code>n</code> で <code>VIM</code> へ移動する',
      hint: '<code>:set ic</code> と打って Enter を押してから、<code>n</code> を押そう。今度は <code>VIM</code> も見つかります。',
      praise: ['VIM も見つかった！', 'ignorecase、使いこなせたね！'],
      done: at(capitals),
      require: ['n'],
    },
    {
      id: 'highlight',
      text: '<code>:set hls is</code> で、見つかった所を光らせる',
      hint: '<code>:set hls is</code> と打って Enter を押そう。<code>hls</code> と <code>is</code> のあいだは Space を1つ空けます。',
      praise: ['全部光った！', '見つけやすくなったね！'],
      done: (s) => s.options.hlsearch && s.options.incsearch,
    },
    {
      id: 'no-ignore-case',
      text: '<code>:set noic</code> で、大文字と小文字を区別する設定に戻す',
      hint: '<code>:set noic</code> と打って Enter を押そう。オプションの前に <code>no</code> を付けると切れます。',
      praise: ['元どおり！', '設定の切り替え、完璧！ Chapter 6 制覇！'],
      // Also true before :set ic, but only counts once the TODOs before it are done.
      done: (s) => !s.options.ignorecase,
    },
  ],
});
