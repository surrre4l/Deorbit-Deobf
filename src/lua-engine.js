function analyzeLuaSource(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua source is required.");
  }

  const lines = code.split(/\r?\n/);

  let comments = 0;
  let strings = 0;
  let functions = 0;
  let locals = 0;
  let returns = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line.startsWith("--")) {
      comments++;
    }

    const functionMatches =
      line.match(/\bfunction\b/g);

    if (functionMatches) {
      functions += functionMatches.length;
    }

    const localMatches =
      line.match(/\blocal\b/g);

    if (localMatches) {
      locals += localMatches.length;
    }

    const returnMatches =
      line.match(/\breturn\b/g);

    if (returnMatches) {
      returns += returnMatches.length;
    }

    const stringMatches =
      line.match(/(["'])(?:\\.|(?!\1).)*\1/g);

    if (stringMatches) {
      strings += stringMatches.length;
    }
  }

  return {
    lineCount: lines.length,
    comments,
    strings,
    functions,
    locals,
    returns,
  };
}

function formatLuaAnalysis(result) {
  return [
    "Lua Analysis",
    "────────────",
    `Lines: ${result.lineCount}`,
    `Comments: ${result.comments}`,
    `Strings: ${result.strings}`,
    `Functions: ${result.functions}`,
    `Local declarations: ${result.locals}`,
    `Returns: ${result.returns}`,
  ].join("\n");
}

module.exports = {
  analyzeLuaSource,
  formatLuaAnalysis,
};