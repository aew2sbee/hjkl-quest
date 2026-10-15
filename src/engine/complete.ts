// A few of Vim's Ex commands, by full name, for completing the command line.
const exCommands = [
  'earlier',
  'echo',
  'edit',
  'else',
  'endif',
  'enew',
  'execute',
  'exit',
  'help',
  'nohlsearch',
  'quit',
  'read',
  'redo',
  'set',
  'substitute',
  'undo',
  'wq',
  'write',
];

// Commands that take a file name.
const fileCommands = new Set(['e', 'edit', 'r', 'read', 'w', 'write', 'wq']);

/**
 * What can finish the last word of `line`, an Ex command line without the ":": command names for the
 * first word, file names after a command that takes one. `base` is the line before that word.
 */
export function completions(line: string, files: string[]): { base: string; matches: string[] } {
  const space = line.lastIndexOf(' ');
  if (space < 0) return { base: '', matches: exCommands.filter((name) => name.startsWith(line)) };
  const word = line.slice(space + 1);
  const command = line.trim().split(/\s+/)[0];
  const matches = fileCommands.has(command) ? files.filter((file) => file.startsWith(word)).sort() : [];
  return { base: line.slice(0, space + 1), matches };
}
