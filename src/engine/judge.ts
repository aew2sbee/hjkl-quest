import type { Lesson, Snapshot, Span, Todo } from '../lessons/types';

type KeyInput = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>;

/**
 * - pass: a Vim key the lesson allows; hand it to Vim
 * - ignore: not a Vim key (modifiers, Tab, Alt/Meta shortcuts); leave it to the browser
 * - arrow: an arrow key; tell the learner to use hjkl
 * - ime: typed while Japanese input (IME) is on; ask the learner to turn it off
 * - not-text: in insert mode, a key that is not text (Enter, Delete, Ctrl keys...)
 * - unlearned: a key this lesson does not teach yet
 */
export type KeyVerdict = 'pass' | 'ignore' | 'arrow' | 'ime' | 'not-text' | 'unlearned';

const arrows: Record<string, string> = { ArrowLeft: 'h', ArrowDown: 'j', ArrowUp: 'k', ArrowRight: 'l' };
// Tab is left to the browser so keyboard users can move focus out of the editor.
const ignored = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']);

/** "Ctrl-r" for Ctrl+R, otherwise `KeyboardEvent.key`. Matches the names in `Lesson.keys`. */
export function keyName(e: KeyInput): string {
  return e.ctrlKey && e.key.length === 1 ? `Ctrl-${e.key.toLowerCase()}` : e.key;
}

export function classifyKey(lesson: Lesson, e: KeyInput, mode = 'normal'): KeyVerdict {
  if (e.key in arrows) return 'arrow';
  if (ignored.has(e.key) || e.metaKey || e.altKey) return 'ignore';
  // With an IME on, the key that starts a composition arrives as "Process" before isComposing is set.
  if (e.key === 'Process') return 'ime';
  if (e.key === 'Escape') return 'pass';
  // In insert mode keys are typed as text, not run as commands. Enter stays out so the line is not split.
  if (mode === 'insert') return !e.ctrlKey && (e.key.length === 1 || e.key === 'Backspace') ? 'pass' : 'not-text';
  return lesson.keys.includes(keyName(e)) ? 'pass' : 'unlearned';
}

/** The hjkl key for an arrow key, e.g. "j" for ArrowDown. */
export const hjklFor = (arrowKey: string): string | undefined => arrows[arrowKey];

/**
 * What to highlight in the editor for `todo`: its target position, or the first place its
 * mark text appears. Null when there is nothing to show, e.g. the marked word was edited away.
 */
export function highlightFor(todo: Todo | undefined, lines: string[]): Span | null {
  if (todo?.target) return { ...todo.target, length: 1 };
  if (!todo?.mark) return null;
  for (let line = 0; line < lines.length; line++) {
    const ch = lines[line].indexOf(todo.mark);
    if (ch >= 0) return { line, ch, length: todo.mark.length };
  }
  return null;
}

/**
 * Returns how many TODOs are done after this snapshot. TODOs are done in order:
 * only the current one can be completed, so reaching a later target early does not count.
 */
export function advance(lesson: Lesson, done: number, s: Snapshot): number {
  while (done < lesson.todos.length && lesson.todos[done].done(s)) done++;
  return done;
}
