function diagnoseLua(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const lines = code.split(/\r?\n/);
  const issues = [];

  let blockDepth = 0;

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line || line.startsWith("--")) {
      return;
    }

    // Basic block tracking.
    const opens = (
      line.match(
        /\b(function|if|for|while|repeat|do)\b/g
      ) || []
    ).length;

    const closes = (
      line.match(/\bend\b/g) || []
    ).length;

    blockDepth += opens - closes;

    if (blockDepth < 0) {
      issues.push({
        line: lineNumber,
        type: "block",
        message: "Unexpected 'end'.",
      });

      blockDepth = 0;
    }

    // Common assignment mistake.
    if (
      /\bif\b/.test(line) &&
      /\bthen\b/.test(line) === false &&
      !line.includes("--")
    ) {
      issues.push({
        line: lineNumber,
        type: "syntax",
        message: "An if statement may be missing 'then'.",
      });
    }

    // Suspicious empty function declaration.
    if (
      /^function\s+[A-Za-z_][A-Za-z0-9_.:]*\s*\([^)]*\)\s*$/.test(line)
    ) {
      issues.push({
        line: lineNumber,
        type: "syntax",
        message: "Function declaration has no visible body.",
      });
    }

    // Suspicious local declaration.
    if (
      /^local\s+[A-Za-z_][A-Za-z0-9_]*\s*$/.test(line)
    ) {
      issues.push({
        line: lineNumber,
        type: "style",
        message: "Local variable is declared without an assignment.",
      });
    }
  });

  if (blockDepth > 0) {
    issues.push({
      line: lines.length,
      type: "block",
      message: `${blockDepth} block(s) may be missing 'end'.`,
    });
  }

  return issues;
}

function formatDiagnostics(issues) {
  if (!issues.length) {
    return "No obvious issues detected.";
  }

  return issues
    .map(
      (issue) =>
        `Line ${issue.line} [${issue.type}] ${issue.message}`
    )
    .join("\n");
}

module.exports = {
  diagnoseLua,
  formatDiagnostics,
};