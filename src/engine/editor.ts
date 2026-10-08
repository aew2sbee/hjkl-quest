import { EditorSelection, EditorState, Prec, StateEffect, StateField, Text } from '@codemirror/state';
import { Decoration, EditorView, lineNumbers, type DecorationSet } from '@codemirror/view';
import { getCM, vim, Vim } from '@replit/codemirror-vim';
import type { EditorSnapshot, Lesson, Pos, Span } from '../lessons/types';
import { classifyKey, keyName, type KeyVerdict } from './judge';

export interface EditorHandlers {
  /** A key pressed in the editor and what happened to it. Not called for modifiers or Tab. */
  onKey(name: string, verdict: Exclude<KeyVerdict, 'ignore'>): void;
  /** Called after anything the judge looks at changes: text, cursor or mode. */
  onChange(s: EditorSnapshot): void;
  /** `:q` was run. `force` is true for `:q!`. */
  onQuit(force: boolean): void;
  /** `:wq` was run. */
  onWriteQuit(): void;
}

export interface LessonEditor {
  snapshot(): EditorSnapshot;
  /** Highlight the current TODO's target, or clear it with null. */
  setTarget(span: Span | null): void;
  /** Start over in normal mode with `lines` (else the lesson's text) and `cursor` (else the start). */
  reset(lines?: string[], cursor?: Pos): void;
  focus(): void;
}

const setTargetEffect = StateEffect.define<Span | null>();
const targetMark = Decoration.mark({ class: 'cm-target' });

const targetField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (!e.is(setTargetEffect)) continue;
      if (!e.value) {
        deco = Decoration.none;
      } else {
        const from = tr.state.doc.line(e.value.line + 1).from + e.value.ch;
        deco = Decoration.set([targetMark.range(from, from + e.value.length)]);
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// Ex commands are global in codemirror-vim, so route :q and :wq to the editor that ran them.
const exHandlers = new WeakMap<object, EditorHandlers>();
Vim.defineEx('quit', 'q', (cm: object, params: { argString?: string }) => {
  exHandlers.get(cm)?.onQuit(params.argString?.trim() === '!');
});
Vim.defineEx('wq', 'wq', (cm: object) => {
  exHandlers.get(cm)?.onWriteQuit();
});

/** Puts a Vim editor for `lesson` into `parent`. */
export function createLessonEditor(parent: HTMLElement, lesson: Lesson, handlers: EditorHandlers): LessonEditor {
  let mode = 'normal';
  // Normal-mode commands run so far, and the keys of the one being typed (e.g. "d" before "w").
  let commands: string[] = [];
  let typing: string[] = [];

  // Runs before the Vim plugin. Returning true stops the key there (and prevents the browser default).
  const guard = Prec.highest(
    EditorView.domEventHandlers({
      keydown(e) {
        if (e.isComposing) return false;
        const verdict = classifyKey(lesson, e, mode);
        if (verdict === 'ignore') return false;
        const name = keyName(e);
        handlers.onKey(name, verdict);
        if (verdict !== 'pass') return true;
        // Esc cancels a half-typed command, and ":" opens the Ex command line, which is tracked on its own.
        if (mode !== 'normal' || e.key === 'Escape' || e.key === ':') typing = [];
        else typing.push(name);
        return false;
      },
      // Clicking must not move the cursor, or targets could be reached without hjkl.
      mousedown(_e, view) {
        view.focus();
        return true;
      },
    }),
  );

  const makeState = (lines = lesson.buffer, cursor = lesson.start) => {
    const doc = Text.of(lines);
    return EditorState.create({
      doc,
      selection: EditorSelection.cursor(doc.line(cursor.line + 1).from + cursor.ch),
      extensions: [
        guard,
        vim(),
        lineNumbers(),
        targetField,
        EditorState.readOnly.of(lesson.readOnly),
        EditorView.contentAttributes.of({ 'aria-label': `Vim エディタ: ${lesson.fileName}` }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged || u.selectionSet) handlers.onChange(snapshot());
        }),
      ],
    });
  };

  const view = new EditorView({ state: makeState(), parent });

  // Keys typed in the Ex command line (after ":") go to an <input>, not to the guard above. Log them too.
  // Capture phase, because Vim stops Enter on the input before it would bubble up here.
  view.dom.addEventListener(
    'keydown',
    (e) => {
      const logged = e.key.length === 1 || ['Enter', 'Backspace', 'Escape'].includes(e.key);
      if (e.target instanceof HTMLInputElement && logged && !e.isComposing) handlers.onKey(keyName(e), 'pass');
    },
    true,
  );

  // The Vim plugin (and its CodeMirror adapter) is recreated on every setState, so listen again each time.
  const listen = () => {
    mode = 'normal';
    commands = [];
    typing = [];
    const cm = getCM(view);
    if (!cm) return;
    exHandlers.set(cm, handlers);
    // Fired once a command is complete, before it runs, so the change it makes is judged with it.
    cm.on('vim-command-done', () => {
      if (typing.length) commands.push(typing.join(''));
      typing = [];
    });
    cm.on('vim-mode-change', (e: { mode: string }) => {
      mode = e.mode;
      handlers.onChange(snapshot());
    });
  };
  listen();

  function snapshot(): EditorSnapshot {
    const cursor = getCM(view)?.getCursor() ?? { line: 0, ch: 0 };
    return {
      lines: view.state.doc.toString().split('\n'),
      cursor: { line: cursor.line, ch: cursor.ch },
      mode,
      commands: [...commands],
    };
  }

  return {
    snapshot,
    setTarget: (span) => view.dispatch({ effects: setTargetEffect.of(span) }),
    reset(lines, cursor) {
      view.setState(makeState(lines, cursor));
      listen();
    },
    focus: () => view.focus(),
  };
}
