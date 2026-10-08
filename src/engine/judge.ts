import type { Lesson, Snapshot, Span, Todo } from '../lessons/types';

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

export function classifyKey(lesson: Lesson, e: KeyInput, mode = 'normal'): KeyVerdict {
  if (e.key in arrows) return 'arrow';
  if (ignored.has(e.key) || e.metaKey || e.altKey) return 'ignore';
  if (e.key === 'Escape') return 'pass';
  // In insert mode keys are typed as text, not run as commands. Enter stays out so the line is not split.
  if (mode === 'insert' && !e.ctrlKey && (e.key.length === 1 || e.key === 'Backspace')) return 'pass';
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
 * Where the TODOs stand. `holds` has each TODO not done yet whose condition holds, with the
 * command that made it hold (null when it already held as Vim opened). `wrong` is a TODO that
 * was made to hold by a command it does not allow.
 */
export interface Progress {
  done: number;
  holds: Map<string, string | null>;
  wrong?: Todo;
}

export const startProgress = (done = 0): Progress => ({ done, holds: new Map() });

const allowed = (todo: Todo, by: string | null) => !todo.require || by === null || todo.require.includes(by);

/**
 * Judges the TODOs against a new snapshot. TODOs are done in order: only the current one can
 * be completed, so reaching a later target early does not count. A later text fix does count
 * once the TODOs before it are done, as long as it was made with an allowed command.
 */
export function step(lesson: Lesson, p: Progress, s: Snapshot): Progress {
  const by = s.commands.at(-1) ?? null;
  const holds = new Map<string, string | null>();
  for (const todo of lesson.todos.slice(p.done)) {
    if (todo.done(s)) holds.set(todo.id, p.holds.has(todo.id) ? p.holds.get(todo.id)! : by);
  }
  const counts = (todo: Todo) => holds.has(todo.id) && allowed(todo, holds.get(todo.id)!);
  let done = p.done;
  while (done < lesson.todos.length && counts(lesson.todos[done])) {
    holds.delete(lesson.todos[done].id);
    done++;
  }
  // A target only counts while it is the current one (the cursor moves on), but a fix stays in the text.
  const wrong = lesson.todos
    .slice(done)
    .find((t, i) => holds.has(t.id) && !counts(t) && (i === 0 || !t.target));
  return { done, holds, wrong };
}

/** How many TODOs are done after this snapshot, starting from `done`. */
export const advance = (lesson: Lesson, done: number, s: Snapshot): number =>
  step(lesson, startProgress(done), s).done;
