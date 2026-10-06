/** Zero-based position in the buffer. */
export interface Pos {
  line: number;
  ch: number;
}

/** The editor part of a snapshot. */
export interface EditorSnapshot {
  lines: string[];
  cursor: Pos;
  /** Vim mode: "normal", "insert", "visual", "replace". */
  mode: string;
}

/** What the judge sees after every key. */
export interface Snapshot extends EditorSnapshot {
  /** Which screen is showing: the shell prompt or Vim. */
  screen: 'shell' | 'vim';
  /** Commands run so far, in order: shell commands ("vim") and Ex commands (":q!"). */
  ran: string[];
}

export interface Todo {
  id: string;
  /** Shown in the quest panel. HTML, so commands can be wrapped in <code>. */
  text: string;
  /** HTML shown when the learner asks for a hint. */
  hint: string;
  /** One is picked at random when the TODO is done. */
  praise: string[];
  done: (s: Snapshot) => boolean;
  /** Highlighted in the editor while this TODO is the current one. */
  target?: Pos;
}

export interface Lesson {
  /** "1-1" for vimtutor lesson 1.1. Also the URL segment. */
  id: string;
  /** Short name for the chapter list. */
  title: string;
  /** Quest heading. */
  heading: string;
  /** Sentences shown under the heading, one per line. HTML. */
  lead: string[];
  fileName: string;
  /** Start at the shell prompt, so the learner launches Vim with `vim`. */
  shell: boolean;
  buffer: string[];
  start: Pos;
  readOnly: boolean;
  /**
   * Keys passed to Vim, as `KeyboardEvent.key` values. Escape is always allowed.
   * Anything else is stopped before Vim sees it, so a TODO can only be done with
   * the commands the lesson teaches.
   */
  keys: string[];
  /** Fewest keys that clear every TODO. Used for the star rating. */
  optimalKeys: number;
  todos: Todo[];
}

export const defineLesson = (lesson: Lesson): Lesson => lesson;
