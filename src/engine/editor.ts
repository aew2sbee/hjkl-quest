import { EditorSelection, EditorState, Prec, StateEffect, StateField, Text } from '@codemirror/state';
import { Decoration, EditorView, lineNumbers, type DecorationSet } from '@codemirror/view';
import { getCM, vim } from '@replit/codemirror-vim';
import type { Lesson, Pos, Snapshot } from '../lessons/types';
import { classifyKey, keyName, type KeyVerdict } from './judge';

export interface EditorHandlers {
  /** A key pressed in the editor and what happened to it. Not called for modifiers or Tab. */
  onKey(name: string, verdict: Exclude<KeyVerdict, 'ignore'>): void;
  /** Called after anything the judge looks at changes: text, cursor or mode. */
  onChange(s: Snapshot): void;
}

export interface LessonEditor {
  snapshot(): Snapshot;
  /** Highlight the current TODO's target, or clear it with null. */
  setTarget(p: Pos | null): void;
  /** Start the lesson over: original text, start position, normal mode. */
  reset(): void;
  focus(): void;
}

const setTargetEffect = StateEffect.define<Pos | null>();
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
        deco = Decoration.set([targetMark.range(from, from + 1)]);
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

/** Puts a Vim editor for `lesson` into `parent`. */
export function createLessonEditor(parent: HTMLElement, lesson: Lesson, handlers: EditorHandlers): LessonEditor {
  let mode = 'normal';

  // Runs before the Vim plugin. Returning true stops the key there (and prevents the browser default).
  const guard = Prec.highest(
    EditorView.domEventHandlers({
      keydown(e) {
        if (e.isComposing) return false;
        const verdict = classifyKey(lesson, e);
        if (verdict === 'ignore') return false;
        handlers.onKey(keyName(e), verdict);
        return verdict !== 'pass';
      },
      // Clicking must not move the cursor, or targets could be reached without hjkl.
      mousedown(_e, view) {
        view.focus();
        return true;
      },
    }),
  );

  const makeState = () => {
    const doc = Text.of(lesson.buffer);
    return EditorState.create({
      doc,
      selection: EditorSelection.cursor(doc.line(lesson.start.line + 1).from + lesson.start.ch),
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

  // The Vim plugin (and its CodeMirror adapter) is recreated on every setState, so listen again each time.
  const listen = () => {
    mode = 'normal';
    getCM(view)?.on('vim-mode-change', (e: { mode: string }) => {
      mode = e.mode;
      handlers.onChange(snapshot());
    });
  };
  listen();

  function snapshot(): Snapshot {
    const cursor = getCM(view)?.getCursor() ?? { line: 0, ch: 0 };
    return {
      lines: view.state.doc.toString().split('\n'),
      cursor: { line: cursor.line, ch: cursor.ch },
      mode,
    };
  }

  return {
    snapshot,
    setTarget: (p) => view.dispatch({ effects: setTargetEffect.of(p) }),
    reset() {
      view.setState(makeState());
      listen();
    },
    focus: () => view.focus(),
  };
}
