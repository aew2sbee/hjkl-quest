/** What a line typed at the shell prompt means. */
export type ShellCommand =
  | { kind: 'empty' }
  | { kind: 'vim' }
  | { kind: 'no-file' }
  | { kind: 'other-file'; file: string }
  | { kind: 'unknown'; name: string };

/** `vim` and `vim <fileName>` open the lesson file. With `needsName`, only `vim <fileName>` does. */
export function parseShellCommand(input: string, fileName: string, needsName = false): ShellCommand {
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { kind: 'empty' };
  if (words[0] !== 'vim') return { kind: 'unknown', name: words[0] };
  if (words.length === 1) return needsName ? { kind: 'no-file' } : { kind: 'vim' };
  if (words.length === 2 && words[1] === fileName) return { kind: 'vim' };
  return { kind: 'other-file', file: words.slice(1).join(' ') };
}

export interface ShellHandlers {
  /** A key typed at the prompt, for the key log. */
  onKey(name: string): void;
  /** Enter was pressed. The line has already been echoed. */
  onCommand(input: string): void;
}

export interface Shell {
  /** Add an output line under the last command. */
  print(text: string, kind?: 'err' | 'tip'): void;
  /** Clear the history and the input. */
  reset(): void;
  focus(): void;
}

const PROMPT = '~/quest $';
const MAX_LINES = 8;

type LineKind = 'cmd' | 'err' | 'tip';

/**
 * A pretend shell inside `el`. Typed text is shown with textContent, never as HTML.
 * `open` is the command suggested at the empty prompt, e.g. "vim".
 */
export function createShell(el: HTMLElement, banner: string, open: string, handlers: ShellHandlers): Shell {
  let input = '';
  let history: { text: string; kind?: LineKind }[] = [];

  el.tabIndex = 0;
  el.setAttribute('role', 'textbox');
  el.setAttribute('aria-label', 'シェル');

  const span = (cls: string, text: string) => {
    const s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    return s;
  };

  const line = (text: string, cls?: string) => {
    const div = document.createElement('div');
    div.className = cls ? `sh ${cls}` : 'sh';
    div.textContent = text;
    return div;
  };

  const promptLine = (text: string) => {
    const div = line('');
    div.append(span('p', PROMPT), ` ${text}`);
    return div;
  };

  function render() {
    const prompt = promptLine(input);
    prompt.append(span('caret', ' '));
    if (!input) prompt.append(span('ghost', `  ← ${open} と入力して Enter`));
    el.replaceChildren(
      line(banner, 'ghost'),
      ...history.map((h) => (h.kind === 'cmd' ? promptLine(h.text) : line(h.text, h.kind))),
      prompt,
    );
  }

  const push = (text: string, kind?: LineKind) => {
    history = [...history, { text, kind }].slice(-MAX_LINES);
  };

  el.addEventListener('keydown', (e) => {
    if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      handlers.onKey('Enter');
      const cmd = input;
      push(cmd, 'cmd');
      input = '';
      render();
      handlers.onCommand(cmd);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handlers.onKey('Backspace');
      input = input.slice(0, -1);
      render();
    } else if (e.key.length === 1) {
      e.preventDefault();
      handlers.onKey(e.key === ' ' ? 'Space' : e.key);
      input += e.key;
      render();
    }
  });

  render();

  return {
    print(text, kind) {
      push(text, kind);
      render();
    },
    reset() {
      input = '';
      history = [];
      render();
    },
    focus: () => el.focus(),
  };
}
