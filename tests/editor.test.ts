// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createLessonEditor, type EditorHandlers } from '../src/engine/editor';
import { classifyKey, startProgress, step, type Progress } from '../src/engine/judge';
import lesson2_1 from '../src/lessons/2-1';
import lesson2_2 from '../src/lessons/2-2';
import lesson2_3 from '../src/lessons/2-3';
import type { Lesson } from '../src/lessons/types';

// jsdom has no layout. CodeMirror measures text with these, so give it empty boxes.
const noRects = () => Object.assign([], { item: () => null }) as unknown as DOMRectList;
Range.prototype.getClientRects = noRects;
Range.prototype.getBoundingClientRect = () => new DOMRect();

/** "Ctrl-r" as the keydown it comes from. */
function keyEvent(key: string) {
  const ctrlKey = key.startsWith('Ctrl-');
  return { key: ctrlKey ? key.slice(5) : key, ctrlKey, metaKey: false, altKey: false };
}

/** A lesson editor in a fresh DOM, and a way to type keys into it. */
function open(lesson: Lesson, handlers: Partial<EditorHandlers> = {}) {
  const parent = document.createElement('div');
  document.body.replaceChildren(parent);
  const editor = createLessonEditor(parent, lesson, {
    onKey() {},
    onChange() {},
    onQuit() {},
    onWriteQuit() {},
    ...handlers,
  });
  const content = parent.querySelector<HTMLElement>('.cm-content')!;
  const press = (...keys: string[]) => {
    for (const key of keys) {
      content.dispatchEvent(new KeyboardEvent('keydown', { ...keyEvent(key), bubbles: true, cancelable: true }));
    }
  };
  return { editor, press };
}

/**
 * Plays `keys` in Vim, as if typed after "vim" + Enter at the shell, judging after every change
 * like the lesson page does. Fails on a key the lesson would stop.
 */
function play(lesson: Lesson, keys: string[]): Progress {
  let progress = startProgress();
  let mode = 'normal';
  const { press } = open(lesson, {
    onChange(s) {
      mode = s.mode;
      progress = step(lesson, progress, { ...s, screen: 'vim', ran: ['vim'] });
    },
  });
  for (const key of keys) {
    expect(classifyKey(lesson, keyEvent(key), mode), key).toBe('pass');
    press(key);
  }
  return progress;
}

/** "w w dw" → ["w", "w", "d", "w"]. Keys are single characters, or Escape / Ctrl-x. */
const keys = (seq: string) =>
  seq.split(' ').flatMap((k) => (k.length > 1 && !k.startsWith('Ctrl-') && k !== 'Escape' ? [...k] : [k]));

describe('lesson editor', () => {
  it('records each normal-mode command once it is complete', () => {
    const { editor, press } = open(lesson2_1);
    press('w', 'w', 'w', 'd');
    expect(editor.snapshot().commands).toEqual(['w', 'w', 'w']);
    press('w');
    expect(editor.snapshot()).toMatchObject({
      lines: ['---> Please keep the noisy important words only.'],
      commands: ['w', 'w', 'w', 'dw'],
    });
  });

  it('judges a change with the command that made it', () => {
    const seen: string[][] = [];
    const { press } = open(lesson2_1, { onChange: (s) => seen.push(s.commands) });
    press('d', 'w');
    expect(seen.at(-1)).toEqual(['dw']);
  });

  it('leaves out text typed in insert mode, Esc and the Ex command line', () => {
    const { editor, press } = open(lesson2_1);
    press('i', 'a', 'b', 'Escape', 'd', 'Escape', 'x', ':');
    expect(editor.snapshot().commands).toEqual(['i', 'x']);
  });

  it('starts over with the given text and cursor', () => {
    const { editor, press } = open(lesson2_1);
    press('x');
    editor.reset(['---> one two'], { line: 0, ch: 5 });
    expect(editor.snapshot()).toMatchObject({ lines: ['---> one two'], cursor: { line: 0, ch: 5 }, commands: [] });
  });
});

describe('lesson 2-1 in Vim', () => {
  it('clears in optimalKeys with www dw w dw', () => {
    const seq = keys('w w w dw w dw');
    expect(play(lesson2_1, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson2_1.optimalKeys);
  });

  it('asks for dw when very is deleted with x', () => {
    const p = play(lesson2_1, keys('w w w x x x x x'));
    expect(p.done).toBe(0);
    expect(p.wrong?.id).toBe('delete-very');
  });
});

describe('lesson 2-2 in Vim', () => {
  it('clears in optimalKeys with 5w l d$, j w l d$', () => {
    const seq = keys('w w w w w l d$ j w l d$');
    expect(play(lesson2_2, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson2_2.optimalKeys);
  });

  it('asks for d$ when the end is deleted word by word', () => {
    const p = play(lesson2_2, keys('w w w w w l dw dw dw dw dw'));
    expect(p.done).toBe(0);
    expect(p.wrong?.id).toBe('cut-lunch');
  });
});

describe('lesson 2-3 in Vim', () => {
  it('clears in optimalKeys with www e hh de, e e hh de', () => {
    const seq = keys('w w w e h h de e e h h de');
    expect(play(lesson2_3, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson2_3.optimalKeys);
  });

  it('does not count dw, which takes the space too', () => {
    expect(play(lesson2_3, keys('w w w e h h dw'))).toMatchObject({ done: 0, wrong: undefined });
  });

  it('asks for de when the letters are deleted with x', () => {
    const p = play(lesson2_3, keys('w w w e h h x x x'));
    expect(p.done).toBe(0);
    expect(p.wrong?.id).toBe('cut-ish');
  });
});
