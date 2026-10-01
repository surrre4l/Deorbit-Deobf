function analyzeTokens(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const strings = [];
  const comments = [];
  const numbers = [];
  const identifiers = new Set();

  const stringRegex = /(["'])(?:\\.|(?!\1)[\s\S])*\1/g;
  const commentRegex = /--[^\r\n]*/g;
  const numberRegex = /\b\d+(?:\.\d+)?\b/g;
  const identifierRegex =
    /\b[A-Za-z_][A-Za-z0-9_]*\b/g;

  let match;

  while ((match = stringRegex.exec(code)) !== null) {
    strings.push(match[0]);
  }

  while ((match = commentRegex.exec(code)) !== null) {
    comments.push(match[0]);
  }

  while ((match = numberRegex.exec(code)) !== null) {
    numbers.push(match[0]);
  }

  const luaKeywords = new Set([
    "and",
    "break",
    "do",
    "else",
    "elseif",
    "end",
    "false",
    "for",
    "function",
    "goto",
    "if",
    "in",
    "local",
    "nil",
    "not",
    "or",
    "repeat",
    "return",
    "then",
    "true",
    "until",
    "while",
  ]);

  while ((match = identifierRegex.exec(code)) !== null) {
    const identifier = match[0];

    if (!luaKeywords.has(identifier)) {
      identifiers.add(identifier);
    }
  }

  return {
    strings,
    comments,
    numbers,
    identifiers: [...identifiers],
  };
}

function formatTokenAnalysis(result) {
  return [
    `String literals: ${result.strings.length}`,
    `Comments: ${result.comments.length}`,
    `Numeric literals: ${result.numbers.length}`,
    `Unique identifiers: ${result.identifiers.length}`,
  ].join("\n");
}

module.exports = {
  analyzeTokens,
  formatTokenAnalysis,
};