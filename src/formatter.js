function formatLua(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const lines = code
    .replace(/\r\n/g, "\n")
    .split("\n");

  let indent = 0;
  const output = [];

  const decreaseBefore = /^(end|until|\}|else\b|elseif\b)/;
  const increaseAfter =
    /\b(then|do)\s*$|\bfunction\s+[A-Za-z_][A-Za-z0-9_.:]*\s*\(/;

  for (let rawLine of lines) {
    let line = rawLine.trim();

    if (!line) {
      output.push("");
      continue;
    }

    if (decreaseBefore.test(line)) {
      indent = Math.max(0, indent - 1);
    }

    output.push(`${"    ".repeat(indent)}${line}`);

    if (increaseAfter.test(line) && !/\bend\s*$/.test(line)) {
      indent++;
    }

    if (/^else\b/.test(line) || /^elseif\b/.test(line)) {
      indent++;
    }

    if (/^repeat\b/.test(line)) {
      indent++;
    }
  }

  return output.join("\n");
}

module.exports = {
  formatLua,
};