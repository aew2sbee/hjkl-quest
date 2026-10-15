import { defineLesson, type Pos, type Snapshot } from './types';

// A long file, so that jumping to the end and back is worth a command.
const walk = [
  'This is a long file about a walk in the hills.',
  'We left home early in the morning.',
  'The sky was grey, but it did not rain.',
  'A small dog followed us to the gate.',
  'We crossed a wooden bridge over a stream.',
  'The path turned left at an old oak tree.',
  'Some sheep watched us from the field.',
  'We stopped to drink some water.',
  'The hill was steeper than we thought.',
  'My shoes were full of mud.',
  'A farmer waved at us from his tractor.',
  'We found a bench with a good view.',
  'The wind was cold at the top.',
  'We ate our sandwiches there.',
  '*** You started here. Remember this line! ***',
  'Then we walked down the other side.',
  'The trees gave us some shade.',
  'We saw a deer near the river.',
  'It ran away as soon as it saw us.',
  'The sun came out after lunch.',
  'We took a lot of photos.',
  'A bird sang in a tall pine tree.',
  'My legs started to feel tired.',
  'We rested on a big flat rock.',
  'The village was not far now.',
  'We could see the church tower.',
  'A cafe was still open on the square.',
  'We had hot tea and cake.',
  'Then we took the bus back home.',
  'This is the last line of the file.',
].map((line) => `---> ${line}`);

const startLine: Pos = { line: 14, ch: 0 };
const lastLine: Pos = { line: walk.length - 1, ch: 0 };
const firstLine: Pos = { line: 0, ch: 0 };

const onLine = (p: Pos) => (s: Snapshot) => s.cursor.line === p.line;

export default defineLesson({
  id: '4-1',
  title: '位置とファイルの情報',
  heading: 'Ctrl-G と G で、長いファイルを行き来しよう',
  lead: [
    '<code>Ctrl-G</code>（Ctrl と <code>g</code>）を押すと、今いる行の番号とファイルの行数が下に出ます。',
    '<code>G</code> で最後の行へ、<code>gg</code> で最初の行へ飛べます。<code>15G</code> のように行番号を先に打つと、その行へ飛べます。',
  ],
  fileName: 'lesson4-1.txt',
  shell: true,
  buffer: walk,
  start: startLine,
  // Only moving is judged here, so the text stays as it is.
  readOnly: true,
  keys: ['h', 'j', 'k', 'l', 'x', 'i', 'A', 'd', 'w', 'e', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'U', 'Ctrl-r', 'p', 'r', 'c', 'G', 'g', 'Ctrl-g', ':'],
  // "vim" + Enter, Ctrl-G, G, gg, 15G
  optimalKeys: 11,
  todos: [
    {
      id: 'show-line',
      text: '<code>Ctrl-G</code> で、今いる行の番号を表示する',
      hint: 'Ctrl を押したまま <code>g</code> を押そう。エディタの下に <code>line 15 of 30</code> のように出ます。',
      praise: ['15 行目にいるんだね！', '行番号、覚えておこう！'],
      done: (s) => s.commands.at(-1) === 'Ctrl-g',
    },
    {
      id: 'to-last',
      target: lastLine,
      text: '<code>G</code> で最後の行へ移動する',
      hint: 'Shift を押しながら <code>g</code> を押すと <code>G</code> です。',
      praise: ['一気にゴール！', 'j を何回も押さずに済んだね！'],
      done: onLine(lastLine),
      require: ['G'],
    },
    {
      id: 'to-first',
      target: firstLine,
      text: '<code>gg</code> で最初の行へ移動する',
      hint: '小文字の <code>g</code> を2回続けて押そう。',
      praise: ['スタート地点に戻った！', 'gg もばっちり！'],
      done: onLine(firstLine),
      require: ['gg'],
    },
    {
      id: 'back-to-start',
      target: startLine,
      text: '<code>Ctrl-G</code> で見た行番号を打ってから <code>G</code> を押し、最初にいた行へ戻る',
      hint: '最初にいたのは 15 行目です。<code>1</code> <code>5</code> <code>G</code> と押そう。',
      praise: ['元の場所に戻ってこれた！', '行番号でひとっ飛び！'],
      done: onLine(startLine),
      require: ['15G'],
    },
  ],
});
