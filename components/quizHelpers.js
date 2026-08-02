// Placeholder for quiz helper functions

export function normalizeCommand(command) {
  return command.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function parseCommand(command) {
  const parts = normalizeCommand(command).split(' ');
  return {
    cmd: parts[0],
    args: parts.slice(1),
  };
}

export function matchesCommand(typedCommand, ...expectedCommands) {
  const normalizedTyped = normalizeCommand(typedCommand);
  return expectedCommands.some(expected => normalizedTyped.startsWith(normalizeCommand(expected)));
}

export function fsEntryExists(fs, path, type = null) {
  // This is a simplified mock. A real FS simulator would be more complex.
  // For now, we'll just assume existence if the path is not empty.
  // In a real simulator, 'fs' would be the file system state.
  return path !== '';
}

export function fsFileContentIncludes(fs, path, content) {
  // This is a simplified mock.
  return true; // Assume content is included for now
}