/** What a line typed at the shell prompt means. */
export type ShellCommand =
  | { kind: 'empty' }
  | { kind: 'vim' }
  | { kind: 'other-file'; file: string }
  | { kind: 'unknown'; name: string };

/** `vim` and `vim <fileName>` open the lesson file. */
export function parseShellCommand(input: string, fileName: string): ShellCommand {
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { kind: 'empty' };
  if (words[0] !== 'vim') return { kind: 'unknown', name: words[0] };
  if (words.length === 1 || (words.length === 2 && words[1] === fileName)) return { kind: 'vim' };
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

/** A pretend shell inside `el`. Typed text is shown with textContent, never as HTML. */
export function createShell(el: HTMLElement, banner: string, handlers: ShellHandlers): Shell {
  let input = '';
  let history: { text: string; kind?: 'cmd' | 'err' | 'tip' }[] = [];

  el.tabIndex = 0;
  el.setAttribute('role', 'textbox');
  el.setAttribute('aria-label', 'シェル');

  const line = (text: string, cls?: string) => {
    const div = document.createElement('div');
    div.className = cls ? `sh ${cls}` : 'sh';
    div.textContent = text;
    return div;
  };

  function render() {
    const prompt = document.createElement('div');
    prompt.className = 'sh';
    const p = document.createElement('span');
    p.className = 'p';
    p.textContent = PROMPT;
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.textContent = ' ';
    prompt.append(p, ` ${input}`, caret);
    if (!input) {
      const ghost = document.createElement('span');
      ghost.className = 'ghost';
      ghost.textContent = '  ← vim と入力して Enter';
      prompt.append(ghost);
    }
    el.replaceChildren(
      line(banner, 'ghost'),
      ...history.map((h) => (h.kind === 'cmd' ? promptLine(h.text) : line(h.text, h.kind))),
      prompt,
    );
  }

  const promptLine = (text: string) => {
    const div = line('');
    const p = document.createElement('span');
    p.className = 'p';
    p.textContent = PROMPT;
    div.append(p, ` ${text}`);
    return div;
  };

  const push = (text: string, kind?: 'cmd' | 'err' | 'tip') => {
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
