function diagnoseLua(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua source is required.");
  }

  const lines = code.split(/\r?\n/);
  const diagnostics = [];

  let openBlocks = 0;

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line || line.startsWith("--")) {
      return;
    }

    const strings = line.match(/(["'])(?:\\.|(?!\1).)*\1/g) || [];

    let cleaned = line;

    for (const string of strings) {
      cleaned = cleaned.replace(string, "");
    }

    const opens =
      cleaned.match(
        /\b(function|then|do|repeat)\b/g
      ) || [];

    const closes =
      cleaned.match(
        /\b(end|until)\b/g
      ) || [];

    openBlocks += opens.length;
    openBlocks -= closes.length;

    if (openBlocks < 0) {
      diagnostics.push({
        line: lineNumber,
        type: "error",
        message: "Unexpected block terminator.",
      });

      openBlocks = 0;
    }

    if (
      /\bif\b/.test(cleaned) &&
      !/\bthen\b/.test(cleaned)
    ) {
      diagnostics.push({
        line: lineNumber,
        type: "warning",
        message: "Possible missing 'then'.",
      });
    }

    if (
      /\blocal\s*$/.test(cleaned)
    ) {
      diagnostics.push({
        line: lineNumber,
        type: "warning",
        message: "Incomplete local declaration.",
      });
    }
  });

  if (openBlocks > 0) {
    diagnostics.push({
      line: lines.length,
      type: "warning",
      message: `Possible missing 'end' or 'until' for ${openBlocks} open block(s).`,
    });
  }

  return diagnostics;
}

function formatDiagnostics(diagnostics) {
  if (!diagnostics.length) {
    return "No obvious syntax issues detected.";
  }

  return diagnostics
    .map((item) => {
      const prefix =
        item.type === "error"
          ? "ERROR"
          : "WARNING";

      return `${prefix} [Line ${item.line}]: ${item.message}`;
    })
    .join("\n");
}

module.exports = {
  diagnoseLua,
  formatDiagnostics,
};