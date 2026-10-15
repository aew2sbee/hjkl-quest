import { defineLesson, type Pos, type Snapshot } from './types';

const line = '---> if (list[size] == { open: (a + b) }) return;';

// Where % lands from each opening bracket: the bracket that closes it.
const closeParen: Pos = { line: 0, ch: line.lastIndexOf(')') };
const closeSquare: Pos = { line: 0, ch: line.indexOf(']') };
const closeCurly: Pos = { line: 0, ch: line.indexOf('}') };

const at = (p: Pos) => (s: Snapshot) => s.cursor.line === p.line && s.cursor.ch === p.ch;

export default defineLesson({
  id: '4-3',
  title: '% で対応する括弧へ',
  heading: '% で、対になる括弧へ飛ぼう',
  lead: [
    '括弧 <code>(</code> <code>[</code> <code>{</code> の上で <code>%</code> を押すと、対になる閉じ括弧へ飛びます。閉じ括弧の上で押すと、開き括弧へ戻ります。',
    '括弧の外で押すと、その行でカーソルより後ろにある最初の括弧を使います。プログラムの括弧の閉じ忘れを探すときに便利です。',
  ],
  fileName: 'lesson4-3.txt',
  shell: true,
  buffer: [line],
  start: { line: 0, ch: 0 },
  // Only moving is judged here, so the text stays as it is.
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', '/', '?', 'n', 'N', 'Ctrl-o', '%', ':'],
  // "vim" + Enter, % (the first bracket on the line is the "("), % l % (back to "(", then into "list"), l % (past "]")
  optimalKeys: 10,
  todos: [
    {
      id: 'match-paren',
      target: closeParen,
      text: '最初の <code>(</code> と対になる <code>)</code> へ <code>%</code> で移動する',
      hint: '<code>(</code> の上か、それより前で <code>%</code> を押そう。光っている <code>)</code> へ飛びます。',
      praise: ['ひとっ飛び！', '対になる括弧、見つけた！'],
      done: at(closeParen),
      require: ['%'],
    },
    {
      id: 'match-square',
      target: closeSquare,
      text: '<code>[</code> と対になる <code>]</code> へ <code>%</code> で移動する',
      hint: '<code>[</code> の上まで戻って <code>%</code> を押そう。<code>)</code> の上で <code>%</code> を押すと <code>(</code> に戻れます。',
      praise: ['角括弧もばっちり！', '% の使い方、分かってきたね！'],
      done: at(closeSquare),
      require: ['%'],
    },
    {
      id: 'match-curly',
      target: closeCurly,
      text: '<code>{</code> と対になる <code>}</code> へ <code>%</code> で移動する',
      hint: '<code>{</code> の上で <code>%</code> を押そう。中にある <code>( )</code> は飛ばして、対になる <code>}</code> へ飛びます。',
      praise: ['入れ子の括弧も迷わない！', '括弧マスター！'],
      done: at(closeCurly),
      require: ['%'],
    },
  ],
});
