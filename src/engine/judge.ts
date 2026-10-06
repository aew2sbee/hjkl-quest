import type { Lesson, Snapshot } from '../lessons/types';

type KeyInput = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>;

/**
 * - pass: a Vim key the lesson allows; hand it to Vim
 * - ignore: not a Vim key (modifiers, Tab, Alt/Meta shortcuts); leave it to the browser
 * - arrow: an arrow key; tell the learner to use hjkl
 * - unlearned: a key this lesson does not teach yet
 */
export type KeyVerdict = 'pass' | 'ignore' | 'arrow' | 'unlearned';

const arrows: Record<string, string> = { ArrowLeft: 'h', ArrowDown: 'j', ArrowUp: 'k', ArrowRight: 'l' };
// Tab is left to the browser so keyboard users can move focus out of the editor.
const ignored = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']);

/** "Ctrl-r" for Ctrl+R, otherwise `KeyboardEvent.key`. Matches the names in `Lesson.keys`. */
export function keyName(e: KeyInput): string {
  return e.ctrlKey && e.key.length === 1 ? `Ctrl-${e.key.toLowerCase()}` : e.key;
}

export function classifyKey(lesson: Lesson, e: KeyInput): KeyVerdict {
  if (e.key in arrows) return 'arrow';
  if (ignored.has(e.key) || e.metaKey || e.altKey) return 'ignore';
  if (e.key === 'Escape') return 'pass';
  return lesson.keys.includes(keyName(e)) ? 'pass' : 'unlearned';
}

/** The hjkl key for an arrow key, e.g. "j" for ArrowDown. */
export const hjklFor = (arrowKey: string): string | undefined => arrows[arrowKey];

/**
 * Returns how many TODOs are done after this snapshot. TODOs are done in order:
 * only the current one can be completed, so reaching a later target early does not count.
 */
export function advance(lesson: Lesson, done: number, s: Snapshot): number {
  while (done < lesson.todos.length && lesson.todos[done].done(s)) done++;
  return done;
}
