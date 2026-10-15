// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { EditorView } from '@codemirror/view';
import { getCM } from '@replit/codemirror-vim';
import { createLessonEditor, type EditorHandlers } from '../src/engine/editor';
import { startProgress, step, type Progress } from '../src/engine/judge';
import lesson2_1 from '../src/lessons/2-1';
import lesson2_2 from '../src/lessons/2-2';
import lesson2_3 from '../src/lessons/2-3';
import lesson2_4 from '../src/lessons/2-4';
import lesson2_5 from '../src/lessons/2-5';
import lesson2_6 from '../src/lessons/2-6';
import lesson2_7 from '../src/lessons/2-7';
import lesson3_1 from '../src/lessons/3-1';
import lesson3_2 from '../src/lessons/3-2';
import lesson3_3 from '../src/lessons/3-3';
import lesson3_4 from '../src/lessons/3-4';
import lesson4_1 from '../src/lessons/4-1';
import lesson4_2 from '../src/lessons/4-2';
import lesson4_3 from '../src/lessons/4-3';
import lesson4_4 from '../src/lessons/4-4';
import lesson5_1 from '../src/lessons/5-1';
import lesson5_2 from '../src/lessons/5-2';
import lesson5_3 from '../src/lessons/5-3';
import lesson5_4 from '../src/lessons/5-4';
import lesson6_1 from '../src/lessons/6-1';
import lesson6_2 from '../src/lessons/6-2';
import lesson6_3 from '../src/lessons/6-3';
import lesson6_4 from '../src/lessons/6-4';
import lesson6_5 from '../src/lessons/6-5';
import { runShell, type Files } from '../src/engine/files';
import type { EditorSnapshot, Lesson, Pos } from '../src/lessons/types';

// jsdom has no layout. CodeMirror measures text with these, so give it empty boxes.
const noRects = () => Object.assign([], { item: () => null }) as unknown as DOMRectList;
Range.prototype.getClientRects = noRects;
Range.prototype.getBoundingClientRect = () => new DOMRect();

/** "Ctrl-r" as the keydown it comes from. */
function keyEvent(key: string) {
  const ctrlKey = key.startsWith('Ctrl-');
  return { key: ctrlKey ? key.slice(5) : key, ctrlKey, metaKey: false, altKey: false };
}

/** A keydown for `key`. The prompt Vim opens for ":" and "/" still reads Enter and Esc by keyCode. */
function keydown(key: string) {
  const e = new KeyboardEvent('keydown', { ...keyEvent(key), bubbles: true, cancelable: true });
  Object.defineProperty(e, 'keyCode', { value: ({ Enter: 13, Escape: 27 } as Record<string, number>)[key] ?? 0 });
  return e;
}

/** A lesson editor in a fresh DOM, and a way to type keys into it. */
function open(lesson: Lesson, handlers: Partial<EditorHandlers> = {}) {
  const parent = document.createElement('div');
  document.body.replaceChildren(parent);
  const editor = createLessonEditor(parent, lesson, {
    onKey() {},
    onChange() {},
    onQuit() {},
    onWrite() {},
    onWriteQuit() {},
    onMessage() {},
    onShell() {},
    read: () => undefined,
    ...handlers,
  });
  const view = EditorView.findFromDOM(parent.querySelector<HTMLElement>('.cm-editor')!)!;
  // Vim moves j and k by screen lines, which jsdom cannot measure; move by text lines instead.
  const cm = getCM(view)!;
  cm.findPosV = (pos: Pos, amount: number) => ({ line: pos.line + amount, ch: pos.ch });
  const content = parent.querySelector<HTMLElement>('.cm-content')!;
  const press = (...keys: string[]) => {
    for (const key of keys) {
      // jsdom does not type characters from keydown. The browser would, unless the key was stopped.
      const prompt = parent.querySelector<HTMLInputElement>('.cm-vim-panel input');
      if (prompt) {
        const e = keydown(key);
        prompt.dispatchEvent(e);
        if (key.length === 1 && !e.defaultPrevented) prompt.value += key;
        continue;
      }
      const typing = editor.snapshot().mode === 'insert';
      const e = keydown(key);
      content.dispatchEvent(e);
      if (typing && key.length === 1 && !e.defaultPrevented) {
        view.dispatch(view.state.replaceSelection(key), { userEvent: 'input.type' });
      }
    }
  };
  return { editor, press };
}

/**
 * Plays `keys` in Vim, as if typed after "vim" + Enter at the shell, judging after every change
 * like the lesson page does: also after :w and :!cmd, which keep the pretend files.
 * Fails on a key the lesson would stop.
 */
function play(lesson: Lesson, keys: string[]): Progress & { files: Files } {
  let progress = startProgress();
  let verdict = '';
  let files: Files = { ...lesson.files, [lesson.fileName]: lesson.buffer };
  const judge = (s: EditorSnapshot) => (progress = step(lesson, progress, { ...s, screen: 'vim', ran: ['vim'], files }));
  const { editor, press } = open(lesson, {
    onKey: (_name, v) => (verdict = v),
    onChange: judge,
    onWrite(file, lines) {
      files = { ...files, [file ?? lesson.fileName]: lines };
      judge(editor.snapshot());
    },
    onShell(command) {
      files = runShell(command, files).files;
      judge(editor.snapshot());
    },
    read: (source) => (source.startsWith('!') ? runShell(source.slice(1), files).lines : files[source]),
  });
  for (const key of keys) {
    press(key);
    expect(verdict, key).toBe('pass');
  }
  return { ...progress, files };
}

/** "w w dw" → ["w", "w", "d", "w"]. Keys are single characters, or Escape / Ctrl-x. */
const keys = (seq: string) =>
  seq.split(' ').flatMap((k) => (k.length > 1 && !k.startsWith('Ctrl-') && k !== 'Escape' ? [...k] : [k]));

/** Text typed in insert mode, spaces included: one key per character. */
const typed = (text: string) => [...text];

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

describe('lesson 2-4 in Vim', () => {
  it('clears in optimalKeys with 3w, 3e, 0', () => {
    const seq = keys('3w 3e 0');
    expect(play(lesson2_4, seq)).toMatchObject({ done: 3, wrong: undefined });
    expect(4 + seq.length).toBe(lesson2_4.optimalKeys);
  });

  it('asks for 3w when yellow is reached with www', () => {
    const p = play(lesson2_4, keys('w w w'));
    expect(p.done).toBe(0);
    expect(p.wrong?.id).toBe('reach-yellow');
  });

  it('drops the warning once the cursor moves on, and does not warn about later targets', () => {
    expect(play(lesson2_4, keys('w w w w'))).toMatchObject({ done: 0, wrong: undefined });
    // Back at the line start with h is the last TODO's target, but that TODO is not the current one.
    expect(play(lesson2_4, keys('l h'))).toMatchObject({ done: 0, wrong: undefined });
  });

  it('leaves the text as it is', () => {
    const { editor, press } = open(lesson2_4);
    press('x', 'd', 'w');
    expect(editor.snapshot().lines).toEqual(lesson2_4.buffer);
  });
});

describe('lesson 2-5 in Vim', () => {
  it('clears in optimalKeys with 2w d2w, 2w d3w', () => {
    const seq = keys('2w d2w 2w d3w');
    expect(play(lesson2_5, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson2_5.optimalKeys);
  });

  it('also takes the count before the operator', () => {
    expect(play(lesson2_5, keys('2w 2dw 2w 3dw'))).toMatchObject({ done: 2, wrong: undefined });
  });

  it('asks for d2w when the words are deleted one by one', () => {
    const p = play(lesson2_5, keys('2w dw dw'));
    expect(p.done).toBe(0);
    expect(p.wrong?.id).toBe('cut-one-two');
  });
});

describe('lesson 2-6 in Vim', () => {
  it('clears in optimalKeys with j dd, j 2dd', () => {
    const seq = keys('j dd j 2dd');
    expect(play(lesson2_6, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson2_6.optimalKeys);
  });

  it('also takes the count after the operator', () => {
    expect(play(lesson2_6, keys('j dd j d2d'))).toMatchObject({ done: 2, wrong: undefined });
  });

  it('asks for 2dd when the two lines are deleted one by one', () => {
    const p = play(lesson2_6, keys('j dd j dd dd'));
    expect(p.done).toBe(1);
    expect(p.wrong?.id).toBe('cut-moon-sock');
  });

  it('asks for 2dd when the two lines are deleted with dj', () => {
    const p = play(lesson2_6, keys('j dd j dj'));
    expect(p.wrong?.id).toBe('cut-moon-sock');
  });
});

describe('undo in the editor', () => {
  const start = lesson2_7.buffer[0];

  it('undoes one command at a time and redoes with Ctrl-R', () => {
    const { editor, press } = open(lesson2_7);
    press('e', 'e', 'x', 'e', 'x');
    const twoFixed = editor.snapshot().lines[0];
    press('u');
    expect(editor.snapshot().lines[0]).toBe('---> This linee hass extraa letterss.');
    press('u');
    expect(editor.snapshot().lines[0]).toBe(start);
    press('Ctrl-r', 'Ctrl-r');
    expect(editor.snapshot().lines[0]).toBe(twoFixed);
  });

  it('puts the line back with U, and U is undone with u', () => {
    const { editor, press } = open(lesson2_7);
    press('e', 'e', 'x', 'e', 'x');
    const twoFixed = editor.snapshot().lines[0];
    press('U');
    expect(editor.snapshot()).toMatchObject({ lines: [start], commands: ['e', 'e', 'x', 'e', 'x', 'U'] });
    press('u');
    expect(editor.snapshot().lines[0]).toBe(twoFixed);
  });

  it('remembers the line afresh for U after an undo', () => {
    const { editor, press } = open(lesson2_7);
    press('e', 'e', 'x', 'e', 'x', 'U', 'u', 'u', 'u');
    expect(editor.snapshot().lines[0]).toBe(start);
    press('x', 'U');
    expect(editor.snapshot().lines[0]).toBe(start);
  });

  it('stops Ctrl-R before the browser reloads the page', () => {
    const { press } = open(lesson2_7);
    press('x');
    const e = new KeyboardEvent('keydown', { key: 'r', ctrlKey: true, bubbles: true, cancelable: true });
    document.querySelector('.cm-content')!.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
  });

  it('undoes text typed in one visit to insert mode in one step', () => {
    const { editor, press } = open(lesson2_7);
    press('i', 'a', 'b', 'Escape', 'u');
    expect(editor.snapshot().lines[0]).toBe(start);
  });
});

describe('lesson 2-7 in Vim', () => {
  const fix = 'e e x e x e x e x e x';

  it('clears in optimalKeys: fix, U, u, u five times, Ctrl-R five times', () => {
    const seq = keys(`${fix} U u u u u u u Ctrl-r Ctrl-r Ctrl-r Ctrl-r Ctrl-r`);
    expect(play(lesson2_7, seq)).toMatchObject({ done: 5, wrong: undefined });
    expect(4 + seq.length).toBe(lesson2_7.optimalKeys);
  });

  it('does not count going back to the start with u as U', () => {
    expect(play(lesson2_7, keys(`${fix} u u u u u`)).done).toBe(1);
  });
});

describe('lesson 3-1 in Vim', () => {
  it('clears in optimalKeys with dd p, j dd p', () => {
    const seq = keys('dd p j dd p');
    expect(play(lesson3_1, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson3_1.optimalKeys);
  });

  it('counts d moved first', () => {
    expect(play(lesson3_1, keys('j j dd p k k k dd p'))).toMatchObject({ done: 2, wrong: undefined });
  });

  it('asks for p when the order is made some other way', () => {
    const [b, a, d, c] = lesson3_1.buffer;
    // E.g. b) typed again by hand under a) with A, after deleting it with dd.
    const s = { lines: [a, b, d, c], cursor: { line: 1, ch: 0 }, anchor: { line: 1, ch: 0 }, mode: 'normal', commands: ['dd', 'A'], screen: 'vim' as const, ran: ['vim'], files: {}, options: { ignorecase: false, hlsearch: false, incsearch: false } };
    expect(step(lesson3_1, startProgress(), s).wrong?.id).toBe('move-b');
  });
});

describe('lesson 3-2 in Vim', () => {
  it('clears in optimalKeys with 2e re, 4e re, 2w ra', () => {
    const seq = keys('2e re 4e re 2w ra');
    expect(play(lesson3_2, seq)).toMatchObject({ done: 3, wrong: undefined });
    expect(4 + seq.length).toBe(lesson3_2.optimalKeys);
  });

  it('asks for r when the letter is fixed with x and i', () => {
    const lines = ['---> The cat sat on tha mat und slept.'];
    const s = { lines, cursor: { line: 0, ch: 7 }, anchor: { line: 0, ch: 7 }, mode: 'normal', commands: ['2e', 'x', 'i'], screen: 'vim' as const, ran: ['vim'], files: {}, options: { ignorecase: false, hlsearch: false, incsearch: false } };
    expect(step(lesson3_2, startProgress(), s).wrong?.id).toBe('fix-the');
  });
});

describe('lesson 3-3 in Vim', () => {
  it('clears in optimalKeys with 3w ce toy, 4w l ce ike', () => {
    const seq = [...keys('3w ce'), ...typed('toy'), 'Escape', ...keys('4w l ce'), ...typed('ike'), 'Escape'];
    expect(play(lesson3_3, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson3_3.optimalKeys);
  });

  it('is not done until Esc', () => {
    expect(play(lesson3_3, [...keys('3w ce'), ...typed('toy')]).done).toBe(0);
  });

  it('asks for ce when the word is deleted with de and typed with i', () => {
    const p = play(lesson3_3, [...keys('3w de i'), ...typed('toy'), 'Escape']);
    expect(p.wrong?.id).toBe('change-toy');
  });
});

describe('lesson 3-4 in Vim', () => {
  it('clears in optimalKeys with 5w c$ ..., j 4h c$ ...', () => {
    const seq = [...keys('5w c$'), ...typed('warm and sunny.'), 'Escape', ...keys('j 4h c$'), ...typed('two.'), 'Escape'];
    expect(play(lesson3_4, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson3_4.optimalKeys);
  });

  it('asks for c$ when the end is deleted with d$ and typed with A', () => {
    const p = play(lesson3_4, [...keys('5w d$ A'), ...typed('warm and sunny.'), 'Escape']);
    expect(p.wrong?.id).toBe('change-weather');
  });
});

describe('Ctrl-G in the editor', () => {
  it('reports the line like Vim and judges right away', () => {
    const messages: string[] = [];
    const seen: string[][] = [];
    const { press } = open(lesson4_1, { onMessage: (t) => messages.push(t), onChange: (s) => seen.push(s.commands) });
    press('Ctrl-g');
    expect(messages).toEqual(['"lesson4-1.txt" line 15 of 30 --50%-- col 1']);
    expect(seen.at(-1)).toEqual(['Ctrl-g']);
  });

  it('stops Ctrl-G before the browser finds text', () => {
    open(lesson4_1);
    const e = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true, bubbles: true, cancelable: true });
    document.querySelector('.cm-content')!.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
  });
});

describe('lesson 4-1 in Vim', () => {
  it('clears in optimalKeys with Ctrl-G, G, gg, 15G', () => {
    const seq = keys('Ctrl-g G gg 15G');
    expect(play(lesson4_1, seq)).toMatchObject({ done: 4, wrong: undefined });
    expect(4 + seq.length).toBe(lesson4_1.optimalKeys);
  });

  it('asks for G when the last line is reached another way', () => {
    expect(play(lesson4_1, keys('Ctrl-g 30G')).wrong?.id).toBe('to-last');
  });
});

describe('lesson 4-2 in Vim', () => {
  it('clears in optimalKeys with /tr, n, N, Ctrl-O three times and ? alone', () => {
    const seq = [...typed('/tr'), 'Enter', 'n', 'N', 'Ctrl-o', 'Ctrl-o', 'Ctrl-o', '?', 'Enter'];
    expect(play(lesson4_2, seq)).toMatchObject({ done: 5, wrong: undefined });
    expect(4 + seq.length).toBe(lesson4_2.optimalKeys);
  });

  it('clears with the whole word typed', () => {
    const seq = [...typed('/treasure'), 'Enter', 'n', 'N', 'Ctrl-o', 'Ctrl-o', 'Ctrl-o', ...typed('?treasure'), 'Enter'];
    expect(play(lesson4_2, seq)).toMatchObject({ done: 5, wrong: undefined });
  });

  it('records a search as the key that opened it', () => {
    const { editor, press } = open(lesson4_2);
    press(...typed('/treasure'), 'Enter');
    expect(editor.snapshot()).toMatchObject({ commands: ['/'], cursor: { line: 3, ch: 15 } });
  });

  it('asks for Ctrl-O when the start is reached with gg', () => {
    expect(play(lesson4_2, [...typed('/tr'), 'Enter', 'n', 'N', 'g', 'g']).wrong?.id).toBe('jump-back');
  });

  it('stops Ctrl-O before the browser opens a file', () => {
    open(lesson4_2);
    const e = keydown('Ctrl-o');
    document.querySelector('.cm-content')!.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
  });
});

describe('lesson 4-3 in Vim', () => {
  it('clears in optimalKeys with %, % l %, l %', () => {
    const seq = keys('% % l % l %');
    expect(play(lesson4_3, seq)).toMatchObject({ done: 3, wrong: undefined });
    expect(4 + seq.length).toBe(lesson4_3.optimalKeys);
  });

  it('jumps over the brackets inside the braces', () => {
    const { editor, press } = open(lesson4_3);
    press('8', 'w', '%');
    expect(editor.snapshot().cursor.ch).toBe(lesson4_3.buffer[0].indexOf('}'));
  });

  it('asks for % when the bracket is reached with h', () => {
    expect(play(lesson4_3, keys('$ 8h')).wrong?.id).toBe('match-paren');
  });
});

describe('lesson 4-4 in Vim', () => {
  const run = (cmd: string) => [...typed(cmd), 'Enter'];

  it('logs an Ex command as typed, before it changes the text', () => {
    const seen: string[][] = [];
    const { editor, press } = open(lesson4_4, { onChange: (s) => seen.push(s.commands) });
    press(...run(':s/recieve/receive'));
    expect(editor.snapshot().lines[0]).toBe('---> I receive mail, recieve calls and recieve gifts.');
    expect(seen.at(-1)).toEqual([':s/recieve/receive']);
  });

  it('clears in optimalKeys with :s/ie/ei, :s//ei/g, :%s//ei/g', () => {
    const seq = [...run(':s/ie/ei'), ...run(':s//ei/g'), ...run(':%s//ei/g')];
    expect(play(lesson4_4, seq)).toMatchObject({ done: 3, wrong: undefined });
    expect(4 + seq.length).toBe(lesson4_4.optimalKeys);
  });

  it('clears with the commands as the TODOs write them', () => {
    const seq = [...run(':s/recieve/receive'), ...run(':s/recieve/receive/g'), ...run(':%s/recieve/receive/g')];
    expect(play(lesson4_4, seq)).toMatchObject({ done: 3, wrong: undefined });
  });

  it('asks for the first one alone when the whole line is done at once', () => {
    expect(play(lesson4_4, run(':s/recieve/receive/g')).wrong?.id).toBe('first');
  });

  it('asks for /g on every line when the other lines are fixed one at a time', () => {
    const seq = [...run(':s/recieve/receive'), ...run(':s/recieve/receive/g'), 'j', ...run(':s/recieve/receive/g'), 'j', ...run(':s/recieve/receive/g')];
    expect(play(lesson4_4, seq)).toMatchObject({ done: 2, wrong: { id: 'file' } });
  });
});

describe('lesson 5-1 in Vim', () => {
  it('runs :!cmd with what follows the "!"', () => {
    const shell: string[] = [];
    const { press } = open(lesson5_1, { onShell: (cmd) => shell.push(cmd) });
    press(...typed(':!cat todo.txt'), 'Enter');
    expect(shell).toEqual(['cat todo.txt']);
  });

  it('clears in optimalKeys with :!ls and :!cat todo.txt', () => {
    const seq = [...typed(':!ls'), 'Enter', ...typed(':!cat todo.txt'), 'Enter'];
    expect(play(lesson5_1, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson5_1.optimalKeys);
  });
});

describe(':w in the editor', () => {
  it('writes the whole file, or the lines of a range, to the file named', () => {
    const writes: [string | undefined, string[]][] = [];
    const { press } = open(lesson2_6, { onWrite: (file, lines) => writes.push([file, lines]) });
    press(':', 'w', 'Enter', ...typed(':w! all.txt'), 'Enter', ...typed(':2,3w part.txt'), 'Enter');
    expect(writes).toEqual([
      [undefined, lesson2_6.buffer],
      ['all.txt', lesson2_6.buffer],
      ['part.txt', lesson2_6.buffer.slice(1, 3)],
    ]);
  });
});

describe('lesson 5-2 in Vim', () => {
  const run = (cmd: string) => [...typed(cmd), 'Enter'];

  it('clears in optimalKeys with :w backup.txt, :!ls, :!rm backup.txt', () => {
    const seq = [...run(':w backup.txt'), ...run(':!ls'), ...run(':!rm backup.txt')];
    const p = play(lesson5_2, seq);
    expect(p).toMatchObject({ done: 3, wrong: undefined });
    expect(Object.keys(p.files)).toEqual(['lesson5-2.txt']);
    expect(4 + seq.length).toBe(lesson5_2.optimalKeys);
  });

  it('needs the backup to be there when listing', () => {
    expect(play(lesson5_2, run(':!ls')).done).toBe(0);
    expect(play(lesson5_2, [...run(':w backup.txt'), ...run(':!rm backup.txt'), ...run(':!ls')]).done).toBe(1);
  });
});

describe('lesson 5-3 in Vim', () => {
  it('knows where the selection started', () => {
    const { editor, press } = open(lesson5_3);
    press('j', 'l', 'v', 'j', 'j');
    expect(editor.snapshot()).toMatchObject({ mode: 'visual', anchor: { line: 1, ch: 1 }, cursor: { line: 3 } });
    press('Escape');
    expect(editor.snapshot().anchor).toEqual(editor.snapshot().cursor);
  });

  it("clears in optimalKeys with j v j j, :'<,'>w part.txt", () => {
    const seq = [...keys('j v j j'), ...typed(':w part.txt'), 'Enter'];
    const p = play(lesson5_3, seq);
    expect(p).toMatchObject({ done: 2, wrong: undefined });
    expect(p.files['part.txt']).toEqual(lesson5_3.buffer.slice(1, 4));
    expect(4 + seq.length).toBe(lesson5_3.optimalKeys);
  });

  it('asks for the selection when the lines are written by number', () => {
    const p = play(lesson5_3, [...keys('j v j j Escape'), ...typed(':2,4w part.txt'), 'Enter']);
    expect(p).toMatchObject({ done: 1, wrong: { id: 'write' } });
  });
});

describe('lesson 5-4 in Vim', () => {
  const run = (cmd: string) => [...typed(cmd), 'Enter'];

  it('reads a file under the cursor line and undoes it in one step', () => {
    const { editor, press } = open(lesson5_4, { read: () => ['one', 'two'] });
    press('j', ...run(':r part.txt'));
    expect(editor.snapshot()).toMatchObject({ lines: [lesson5_4.buffer[0], lesson5_4.buffer[1], 'one', 'two', ...lesson5_4.buffer.slice(2)], cursor: { line: 2, ch: 0 } });
    press('u');
    expect(editor.snapshot().lines).toEqual(lesson5_4.buffer);
  });

  it('says when the file is not there', () => {
    const messages: string[] = [];
    const { editor, press } = open(lesson5_4, { onMessage: (t) => messages.push(t) });
    press(...run(':r nothing.txt'));
    expect(messages).toEqual(["E484: Can't open file nothing.txt"]);
    expect(editor.snapshot().lines).toEqual(lesson5_4.buffer);
  });

  it('clears in optimalKeys with :3r part.txt and :$r!ls', () => {
    const seq = [...run(':3r part.txt'), ...run(':$r!ls')];
    expect(play(lesson5_4, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson5_4.optimalKeys);
  });

  it('clears with the commands as the TODOs write them', () => {
    expect(play(lesson5_4, [...keys('j j'), ...run(':r part.txt'), 'G', ...run(':r !ls')])).toMatchObject({ done: 2, wrong: undefined });
  });

  it('does not read into a read-only lesson', () => {
    const { editor, press } = open(lesson5_3, { read: () => ['one'] });
    press(...run(':r part.txt'));
    expect(editor.snapshot().lines).toEqual(lesson5_3.buffer);
  });
});

describe('lesson 6-1 in Vim', () => {
  it('clears in optimalKeys with o ... Esc, k O ... Esc', () => {
    const seq = ['o', ...typed('Tuesday: buy milk'), 'Escape', 'k', 'O', ...typed('My plan:'), 'Escape'];
    const p = play(lesson6_1, seq);
    expect(p).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson6_1.optimalKeys);
  });

  it('counts the line above made first', () => {
    const seq = ['O', ...typed('My plan:'), 'Escape', 'j', 'o', ...typed('Tuesday: buy milk'), 'Escape'];
    expect(play(lesson6_1, seq)).toMatchObject({ done: 2, wrong: undefined });
  });

  it('asks for o when the line is opened above Wednesday with O', () => {
    const p = play(lesson6_1, ['j', 'O', ...typed('Tuesday: buy milk'), 'Escape']);
    expect(p.wrong?.id).toBe('open-below');
  });
});

describe('lesson 6-2 in Vim', () => {
  it('clears in optimalKeys with 3e a e, 2e a y, 3e a en', () => {
    const seq = [...keys('3e a'), 'e', 'Escape', ...keys('2e a'), 'y', 'Escape', ...keys('3e a'), ...typed('en'), 'Escape'];
    expect(play(lesson6_2, seq)).toMatchObject({ done: 3, wrong: undefined });
    expect(4 + seq.length).toBe(lesson6_2.optimalKeys);
  });

  it('asks for a when the letter is put in with i', () => {
    const p = play(lesson6_2, [...keys('3e l i'), 'e', 'Escape']);
    expect(p.wrong?.id).toBe('fix-like');
  });
});

describe('lesson 6-3 in Vim', () => {
  it('clears in optimalKeys with 2w R 304, 4w R 12', () => {
    const seq = [...keys('2w R'), ...typed('304'), 'Escape', ...keys('4w R'), ...typed('12'), 'Escape'];
    expect(play(lesson6_3, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson6_3.optimalKeys);
  });

  it('overwrites instead of inserting', () => {
    const { editor, press } = open(lesson6_3);
    press('2', 'w', 'R', '3', '0');
    expect(editor.snapshot()).toMatchObject({ mode: 'replace', lines: ['---> Room 30x is on floor xx.'] });
  });

  it('asks for R when the room is fixed with r', () => {
    expect(play(lesson6_3, keys('2w r3 l r0 l r4')).wrong?.id).toBe('fix-room');
  });
});

describe('lesson 6-4 in Vim', () => {
  it('clears in optimalKeys with 3w v e y, j p, j yy p', () => {
    const seq = keys('3w v e y j p j yy p');
    expect(play(lesson6_4, seq)).toMatchObject({ done: 2, wrong: undefined });
    expect(4 + seq.length).toBe(lesson6_4.optimalKeys);
  });

  it('asks for p when the name is typed in', () => {
    const p = play(lesson6_4, ['j', '$', 'i', ...typed('Alice'), 'Escape']);
    expect(p.wrong?.id).toBe('copy-name');
  });
});

describe('search options in the editor', () => {
  const run = (cmd: string) => [...typed(cmd), 'Enter'];
  const shown = () => document.querySelector('.cm-editor')!.parentElement!.classList.contains('show-matches');

  it('keeps the case of a search unless ignorecase is set, as Vim does', () => {
    const { editor, press } = open(lesson6_5);
    press(...run('/vim'));
    expect(editor.snapshot().cursor).toEqual({ line: 1, ch: 32 });
    press(...run(':set ic'), 'n');
    expect(editor.snapshot().cursor).toEqual({ line: 2, ch: 22 });
    press(...run(':set noic'), 'n');
    expect(editor.snapshot().cursor).toEqual({ line: 3, ch: 19 });
  });

  it('finds lower case with capitals in the search once ignorecase is set', () => {
    const { editor, press } = open(lesson6_5);
    press(...run(':set ic'), ...run('/VIM'));
    expect(editor.snapshot().cursor.line).toBe(0);
  });

  it('sets several options at once, by long or short name, and says which it does not know', () => {
    const messages: string[] = [];
    const { editor, press } = open(lesson6_5, { onMessage: (t) => messages.push(t) });
    press(...run(':set hlsearch is'));
    expect(editor.snapshot().options).toEqual({ ignorecase: false, hlsearch: true, incsearch: true });
    press(...run(':se nohls'), ...run(':set number'));
    expect(editor.snapshot().options.hlsearch).toBe(false);
    expect(messages).toEqual(['E518: Unknown option: number']);
  });

  it('highlights matches only with hlsearch, or with incsearch while a search is typed', () => {
    const { press } = open(lesson6_5);
    press(...run('/vim'));
    expect(shown()).toBe(false);
    press(...run(':set is'), '/');
    expect(shown()).toBe(true);
    press('v', 'Enter');
    expect(shown()).toBe(false);
    press(...run(':set hls'));
    expect(shown()).toBe(true);
  });

  it('starts over with every option off', () => {
    const { editor, press } = open(lesson6_5);
    press(...run(':set ic hls'));
    editor.reset();
    expect(editor.snapshot().options).toEqual({ ignorecase: false, hlsearch: false, incsearch: false });
  });
});

describe('lesson 6-5 in Vim', () => {
  const run = (cmd: string) => [...typed(cmd), 'Enter'];

  it('clears in optimalKeys with /v, :se ic, n, :se hls is, :se noic', () => {
    const seq = [...run('/v'), ...run(':se ic'), 'n', ...run(':se hls is'), ...run(':se noic')];
    expect(play(lesson6_5, seq)).toMatchObject({ done: 4, wrong: undefined });
    expect(4 + seq.length).toBe(lesson6_5.optimalKeys);
  });

  it('clears with the commands as the TODOs write them', () => {
    const seq = [...run('/vim'), ...run(':set ic'), 'n', ...run(':set hls is'), ...run(':set noic')];
    expect(play(lesson6_5, seq)).toMatchObject({ done: 4, wrong: undefined });
  });

  it('asks for n when VIM is found by searching for it', () => {
    expect(play(lesson6_5, [...run('/vim'), ...run('/VIM')]).wrong?.id).toBe('ignore-case');
  });
});
