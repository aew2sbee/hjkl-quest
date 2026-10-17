import { defineLesson, type Pos, type Snapshot } from './types';

const line = '---> red orange yellow green blue indigo violet';

// "---> " counts as a word too, so yellow is the third word after the cursor and blue's end the third end.
const yellow: Pos = { line: 0, ch: line.indexOf('yellow') };
const blueEnd: Pos = { line: 0, ch: line.indexOf('blue') + 'blue'.length - 1 };
const lineStart: Pos = { line: 0, ch: 0 };

const at = (p: Pos) => (s: Snapshot) => s.cursor.line === p.line && s.cursor.ch === p.ch;

export default defineLesson({
  id: '2-4',
  title: 'カウントで移動',
  heading: '数字を付けて、まとめて動こう',
  lead: [
    'モーションの前に数字を打つと、その回数だけ動きます。<code>3w</code> は <code>w</code> を3回、<code>3e</code> は <code>e</code> を3回押したのと同じです。',
    '<code>0</code>（ゼロ）だけを押すと行の先頭に戻ります。黄色く光っている文字まで、1回のコマンドで動こう。',
  ],
  fileName: 'lesson2-4.txt',
  shell: true,
  buffer: [line],
  start: lineStart,
  // Only moving is judged here, so the text stays as it is.
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':'],
  // "vim" + Enter, 3w, 3e, 0
  optimalKeys: 9,
  todos: [
    {
      id: 'reach-yellow',
      target: yellow,
      text: '<code>3w</code> で <code>yellow</code> の先頭へ移動する',
      hint: '行の先頭の <code>---&gt;</code> も1つの単語です。<code>3</code> を押してから <code>w</code> を押そう。',
      praise: ['ひとっ飛び！', 'w を3回押す手間が省けた！'],
      done: at(yellow),
      require: ['3w'],
    },
    {
      id: 'reach-blue',
      target: blueEnd,
      text: '<code>3e</code> で <code>blue</code> の終わりへ移動する',
      hint: '<code>yellow</code> の終わりが1回目、<code>green</code> の終わりが2回目です。<code>3</code> を押してから <code>e</code> を押そう。',
      praise: ['数字の使い方、ばっちり！', 'e もまとめて動けた！'],
      done: at(blueEnd),
      require: ['3e'],
    },
    {
      id: 'back-to-start',
      target: lineStart,
      text: '<code>0</code> で行の先頭に戻る',
      hint: '数字を打たずに <code>0</code> だけを押すと、行の先頭へ戻れます。',
      praise: ['一瞬で行の先頭！', 'カウントと 0、どちらも完璧！'],
      done: at(lineStart),
      require: ['0'],
    },
  ],
});
