function diagnoseLua(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const lines = code.split(/\r?\n/);
  const issues = [];

  let blockDepth = 0;

  const addIssue = (line, type, message) => {
    issues.push({
      line,
      type,
      message,
    });
  };

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line || line.startsWith("--")) {
      return;
    }

    // Basic block tracking
    const openMatches =
      line.match(/\b(function|if|for|while|do|repeat)\b/g) || [];

    const closeMatches =
      line.match(/\bend\b/g) || [];

    blockDepth += openMatches.length;
    blockDepth -= closeMatches.length;

    if (blockDepth < 0) {
      addIssue(
        lineNumber,
        "block",
        "Unexpected 'end'."
      );

      blockDepth = 0;
    }

    // if statement checks
    if (
      /\bif\b/.test(line) &&
      !/\bthen\b/.test(line) &&
      !line.includes("--")
    ) {
      addIssue(
        lineNumber,
        "syntax",
        "An if statement may be missing 'then'."
      );
    }

    // elseif checks
    if (
      /\belseif\b/.test(line) &&
      !/\bthen\b/.test(line)
    ) {
      addIssue(
        lineNumber,
        "syntax",
        "An elseif statement may be missing 'then'."
      );
    }

    // Function declaration checks
    if (
      /^function\s+[A-Za-z_][A-Za-z0-9_.:]*\s*\([^)]*\)\s*$/.test(line)
    ) {
      addIssue(
        lineNumber,
        "syntax",
        "Function declaration has no visible body."
      );
    }

    // Empty local declaration
    if (
      /^local\s+[A-Za-z_][A-Za-z0-9_]*\s*$/.test(line)
    ) {
      addIssue(
        lineNumber,
        "style",
        "Local variable is declared without an assignment."
      );
    }

    // Assignment to obvious Lua keywords
    if (
      /^(end|then|else|elseif|return|local|function|while|for|repeat)\s*=/.test(
        line
      )
    ) {
      addIssue(
        lineNumber,
        "syntax",
        "A Lua keyword appears to be used as an assignment target."
      );
    }

    // Empty function call
    if (
      /\b[A-Za-z_][A-Za-z0-9_.:]*\(\s*\)\s*$/.test(line) &&
      !line.startsWith("function")
    ) {
      addIssue(
        lineNumber,
        "info",
        "Function call has no arguments; verify that this is intentional."
      );
    }

    // Suspicious loadstring usage
    if (/\bloadstring\s*\(/.test(line)) {
      addIssue(
        lineNumber,
        "dynamic",
        "Dynamic Lua loading detected; inspect the source before execution."
      );
    }

    // Deprecated Roblox API pattern
    if (/\bwait\s*\(/.test(line)) {
      addIssue(
        lineNumber,
        "roblox",
        "Legacy wait() usage detected; task.wait() may be preferable."
      );
    }
  });

  if (blockDepth > 0) {
    addIssue(
      lines.length,
      "block",
      `${blockDepth} block(s) may be missing 'end'.`
    );
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