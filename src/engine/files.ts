/** Files in the pretend directory Vim runs in, by name, as lines. */
export type Files = Record<string, string[]>;

/**
 * What the shell prints for `:!cmd`: `ls` and `cat FILE` read the pretend directory.
 * Anything else is not found, as in zsh.
 */
export function runShell(input: string, files: Files): string[] {
  const [name, ...args] = input.trim().split(/\s+/).filter(Boolean);
  if (!name) return [];
  if (name === 'ls') return [Object.keys(files).sort().join('  ')];
  if (name === 'cat') return args.flatMap((file) => files[file] ?? [`cat: ${file}: No such file or directory`]);
  return [`zsh:1: command not found: ${name}`];
}
