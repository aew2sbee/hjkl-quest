import { describe, expect, it } from 'vitest';
import { advance, classifyKey, highlightFor, keyName } from '../src/engine/judge';
import { parseShellCommand } from '../src/engine/shell';
import lesson from '../src/lessons/1-1';
import lesson1_2 from '../src/lessons/1-2';
import lesson1_3 from '../src/lessons/1-3';
import lesson1_4 from '../src/lessons/1-4';
import lesson1_5 from '../src/lessons/1-5';
import { nextLesson } from '../src/lessons';
import type { Pos, Snapshot } from '../src/lessons/types';

const at = (cursor: Pos): Snapshot => ({ lines: lesson.buffer, cursor, mode: 'normal', screen: 'vim', ran: [] });
const after = (screen: Snapshot['screen'], ran: string[]): Snapshot => ({
  lines: lesson1_2.buffer,
  cursor: { line: 0, ch: 0 },
  mode: 'normal',
  screen,
  ran,
});
const key = (k: string, mods: { ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean } = {}) => ({
  key: k,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  ...mods,
});

describe('lesson 1-1', () => {
  it('puts every target on a "*"', () => {
    for (const t of lesson.todos) {
      expect(lesson.buffer[t.target!.line][t.target!.ch]).toBe('*');
    }
  });

  it('completes the TODOs in order', () => {
    let done = advance(lesson, 0, at({ line: 2, ch: 7 }));
    expect(done).toBe(1);
    done = advance(lesson, done, at({ line: 4, ch: 1 }));
    expect(done).toBe(2);
    done = advance(lesson, done, at({ line: 0, ch: 4 }));
    expect(done).toBe(3);
  });

  it('does not count a later target reached early', () => {
    expect(advance(lesson, 0, at({ line: 4, ch: 1 }))).toBe(0);
    expect(advance(lesson, 0, at({ line: 0, ch: 4 }))).toBe(0);
  });

  it('stays done once every TODO is done', () => {
    expect(advance(lesson, 3, at({ line: 0, ch: 0 }))).toBe(3);
  });

  it('matches optimalKeys with the shortest hjkl route', () => {
    // From the start, each target in turn, one key per row or column.
    let from = lesson.start;
    let total = 0;
    for (const t of lesson.todos) {
      total += Math.abs(t.target!.line - from.line) + Math.abs(t.target!.ch - from.ch);
      from = t.target!;
    }
    expect(total).toBe(lesson.optimalKeys);
  });
});

describe('classifyKey', () => {
  it('passes the lesson keys and Escape to Vim', () => {
    for (const k of ['h', 'j', 'k', 'l', 'Escape']) expect(classifyKey(lesson, key(k))).toBe('pass');
  });

  it('flags arrow keys', () => {
    for (const k of ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight']) {
      expect(classifyKey(lesson, key(k))).toBe('arrow');
    }
  });

  it('stops other Vim motions that could reach a target', () => {
    for (const k of ['w', 'G', '$', '0', '3', ' ', 'Backspace', 'Enter', 'x']) {
      expect(classifyKey(lesson, key(k))).toBe('unlearned');
    }
    expect(classifyKey(lesson, key('d', { ctrlKey: true }))).toBe('unlearned');
  });

  it('types any character and Backspace in insert mode, but not Enter', () => {
    for (const k of ['w', 'G', '0', ' ', '.', 'Backspace']) {
      expect(classifyKey(lesson1_4, key(k), 'insert')).toBe('pass');
    }
    expect(classifyKey(lesson1_4, key('Enter'), 'insert')).toBe('unlearned');
    expect(classifyKey(lesson1_4, key('ArrowLeft'), 'insert')).toBe('arrow');
    expect(classifyKey(lesson1_4, key('w'))).toBe('unlearned');
  });

  it('leaves modifiers, Tab and Alt/Meta shortcuts to the browser', () => {
    for (const k of ['Shift', 'Control', 'Tab']) expect(classifyKey(lesson, key(k))).toBe('ignore');
    expect(classifyKey(lesson, key('r', { metaKey: true }))).toBe('ignore');
  });
});

describe('lesson 1-2', () => {
  it('is done after launching Vim and quitting with :q! back to the shell', () => {
    let done = advance(lesson1_2, 0, after('vim', ['vim']));
    expect(done).toBe(1);
    done = advance(lesson1_2, done, after('shell', ['vim', ':q!']));
    expect(done).toBe(2);
  });

  it('does not count quitting before Vim was launched', () => {
    expect(advance(lesson1_2, 0, after('shell', [':q!']))).toBe(0);
  });

  it('does not count :q! until the shell is showing again', () => {
    expect(advance(lesson1_2, 1, after('vim', ['vim', ':q!']))).toBe(1);
  });
});

describe('lesson 1-3', () => {
  const line = (text: string): Snapshot => ({
    lines: [text],
    cursor: { line: 0, ch: 0 },
    mode: 'normal',
    screen: 'vim',
    ran: ['vim'],
  });

  it('is done after fixing all three words', () => {
    let done = advance(lesson1_3, 0, line('---> My dog likess to chasee red balls.'));
    expect(done).toBe(1);
    done = advance(lesson1_3, done, line('---> My dog likes to chasee red balls.'));
    expect(done).toBe(2);
    done = advance(lesson1_3, done, line('---> My dog likes to chase red balls.'));
    expect(done).toBe(3);
  });

  it('catches up when the words are fixed out of order', () => {
    const fixedLater = advance(lesson1_3, 0, line('---> My doog likes to chase red balls.'));
    expect(fixedLater).toBe(0);
    expect(advance(lesson1_3, fixedLater, line('---> My dog likes to chase red balls.'))).toBe(3);
  });

  it('is stuck only when a needed letter is gone', () => {
    expect(lesson1_3.stuck!(line(lesson1_3.buffer[0]))).toBe(false);
    expect(lesson1_3.stuck!(line('---> My dog likes to chase red balls.'))).toBe(false);
    expect(lesson1_3.stuck!(line('---> My og likess to chasee red balls.'))).toBe(true);
    expect(lesson1_3.stuck!(line('--> My doog likess to chasee red balls.'))).toBe(true);
  });
});

describe('lesson 1-4', () => {
  const line = (text: string, mode = 'normal'): Snapshot => ({
    lines: [text],
    cursor: { line: 0, ch: 0 },
    mode,
    screen: 'vim',
    ran: ['vim'],
  });

  it('is done after adding both words and going back to normal mode', () => {
    let done = advance(lesson1_4, 0, line('---> I drink a cup tea every morning.', 'insert'));
    expect(done).toBe(0);
    done = advance(lesson1_4, done, line('---> I drink a cup tea every morning.'));
    expect(done).toBe(1);
    done = advance(lesson1_4, done, line('---> I drink a cup of tea every morning.', 'insert'));
    expect(done).toBe(1);
    done = advance(lesson1_4, done, line('---> I drink a cup of tea every morning.'));
    expect(done).toBe(2);
  });

  it('marks where each word goes', () => {
    expect(highlightFor(lesson1_4.todos[0], lesson1_4.buffer)).toEqual({ line: 0, ch: 7, length: 5 });
    const lines = ['---> I drink a cup tea every morning.'];
    expect(highlightFor(lesson1_4.todos[1], lines)).toEqual({ line: 0, ch: 19, length: 3 });
  });
});

describe('lesson 1-5', () => {
  const lines = (first: string, second: string, mode = 'normal'): Snapshot => ({
    lines: [first, second],
    cursor: { line: 0, ch: 0 },
    mode,
    screen: 'vim',
    ran: ['vim'],
  });
  const [sun, cats] = lesson1_5.buffer;
  const sunDone = '---> The sun rises in the east.';
  const catsDone = '---> Most cats sleep for half of the day.';

  it('is done after adding to both line ends and going back to normal mode', () => {
    let done = advance(lesson1_5, 0, lines(sunDone, cats, 'insert'));
    expect(done).toBe(0);
    done = advance(lesson1_5, done, lines(sunDone, cats));
    expect(done).toBe(1);
    done = advance(lesson1_5, done, lines(sunDone, catsDone));
    expect(done).toBe(2);
  });

  it('catches up when the second line is done first', () => {
    expect(advance(lesson1_5, 0, lines(sun, catsDone))).toBe(0);
    expect(advance(lesson1_5, 0, lines(sunDone, catsDone))).toBe(2);
  });
});

describe('highlightFor', () => {
  it('highlights a target as one character', () => {
    expect(highlightFor(lesson.todos[0], lesson.buffer)).toEqual({ line: 2, ch: 7, length: 1 });
  });

  it('finds the marked word where it is now, after earlier edits moved it', () => {
    const lines = ['---> My dog likess to chasee red balls.'];
    expect(highlightFor(lesson1_3.todos[1], lines)).toEqual({ line: 0, ch: 12, length: 6 });
  });

  it('shows nothing once the marked word is gone, or after the last TODO', () => {
    expect(highlightFor(lesson1_3.todos[1], ['---> My dog likss to chasee red balls.'])).toBeNull();
    expect(highlightFor(undefined, lesson1_3.buffer)).toBeNull();
  });
});

describe('parseShellCommand', () => {
  const parse = (input: string) => parseShellCommand(input, 'lesson1-2.txt');

  it('opens Vim with "vim" or "vim <lesson file>"', () => {
    expect(parse('vim')).toEqual({ kind: 'vim' });
    expect(parse('  vim   lesson1-2.txt ')).toEqual({ kind: 'vim' });
  });

  it('tells other files and other commands apart', () => {
    expect(parse('vim notes.txt')).toEqual({ kind: 'other-file', file: 'notes.txt' });
    expect(parse('vi')).toEqual({ kind: 'unknown', name: 'vi' });
    expect(parse('ls -a')).toEqual({ kind: 'unknown', name: 'ls' });
    expect(parse('   ')).toEqual({ kind: 'empty' });
  });
});

describe('nextLesson', () => {
  it('follows the chapter list and says whether the lesson is built', () => {
    expect(nextLesson('1-1')).toEqual({ id: '1-2', title: '起動と終了', ready: true });
    expect(nextLesson('1-2')).toEqual({ id: '1-3', title: 'x で削除', ready: true });
    expect(nextLesson('1-3')).toEqual({ id: '1-4', title: 'i で挿入', ready: true });
    expect(nextLesson('1-4')).toEqual({ id: '1-5', title: 'A で追記', ready: true });
  });

  it('is undefined after the last lesson', () => {
    expect(nextLesson('1-6')).toBeUndefined();
  });
});

describe('keyName', () => {
  it('names Ctrl combinations like Vim', () => {
    expect(keyName(key('R', { ctrlKey: true }))).toBe('Ctrl-r');
    expect(keyName(key('j'))).toBe('j');
  });
});
