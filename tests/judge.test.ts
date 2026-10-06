import { describe, expect, it } from 'vitest';
import { advance, classifyKey, keyName } from '../src/engine/judge';
import lesson from '../src/lessons/1-1';
import type { Pos, Snapshot } from '../src/lessons/types';

const at = (cursor: Pos): Snapshot => ({ lines: lesson.buffer, cursor, mode: 'normal' });
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

  it('leaves modifiers, Tab and Alt/Meta shortcuts to the browser', () => {
    for (const k of ['Shift', 'Control', 'Tab']) expect(classifyKey(lesson, key(k))).toBe('ignore');
    expect(classifyKey(lesson, key('r', { metaKey: true }))).toBe('ignore');
  });
});

describe('keyName', () => {
  it('names Ctrl combinations like Vim', () => {
    expect(keyName(key('R', { ctrlKey: true }))).toBe('Ctrl-r');
    expect(keyName(key('j'))).toBe('j');
  });
});
