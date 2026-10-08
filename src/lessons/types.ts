/** Zero-based position in the buffer. */
export interface Pos {
  line: number;
  ch: number;
}

/** A run of characters on one line, e.g. a word to highlight. */
export interface Span extends Pos {
  length: number;
}

/** The editor part of a snapshot. */
export interface EditorSnapshot {
  lines: string[];
  cursor: Pos;
  /** Vim mode: "normal", "insert", "visual", "replace". */
  mode: string;
  /**
   * Normal-mode commands run since Vim opened, in order, e.g. ["w", "dw", "i"].
   * Vim counts a command as run before it moves the cursor or changes the text,
   * so during that change the command is already last.
   */
  commands: string[];
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
  /**
   * Commands that may make `done` come true, e.g. ["dw"]. When another command does it,
   * the learner is asked to try again with the first of these. Any command when unset.
   */
  require?: string[];
  /** Highlighted in the editor while this TODO is the current one. */
  target?: Pos;
  /**
   * Text highlighted in the editor while this TODO is the current one, found by search
   * because earlier edits move it. Shows where to look without showing which letter to fix,
   * except where the lesson is about where a command starts (2.2 marks what d$ deletes).
   */
  mark?: string;
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
  /**
   * The file is opened by name (`vim <fileName>`; bare `vim` is not enough) and saved with `:wq`.
   * A saved file opens with what was saved. Other lessons do not save.
   */
  saves?: boolean;
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
  /**
   * True when the text can no longer reach the goal with the commands taught so far,
   * e.g. a needed letter was deleted. The learner is told to start over.
   */
  stuck?: (s: Snapshot) => boolean;
}

export const defineLesson = (lesson: Lesson): Lesson => lesson;
