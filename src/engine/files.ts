/** Files in the pretend directory Vim runs in, by name, as lines. */
export type Files = Record<string, string[]>;

/**
 * What `:!cmd` prints, and the files after it. `ls` lists the files, `cat FILE` prints them and
 * `rm FILE` removes them. Anything else is not found, as in zsh.
 */
export function runShell(input: string, files: Files): { lines: string[]; files: Files } {
  const [name, ...args] = input.trim().split(/\s+/).filter(Boolean);
  if (!name) return { lines: [], files };
  if (name === 'ls') return { lines: [Object.keys(files).sort().join('  ')], files };
  if (name === 'cat') {
    return { lines: args.flatMap((file) => files[file] ?? [`cat: ${file}: No such file or directory`]), files };
  }
  if (name === 'rm') {
    const missing = args.filter((file) => !(file in files));
    const kept = Object.fromEntries(Object.entries(files).filter(([file]) => !args.includes(file)));
    return { lines: missing.map((file) => `rm: cannot remove '${file}': No such file or directory`), files: kept };
  }
  return { lines: [`zsh:1: command not found: ${name}`], files };
}
