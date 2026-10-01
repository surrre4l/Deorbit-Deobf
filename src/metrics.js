function calculateMetrics(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua source is required.");
  }

  const lines = code.split(/\r?\n/);

  const nonEmptyLines = lines.filter(
    (line) => line.trim().length > 0
  );

  const commentLines = lines.filter(
    (line) => line.trim().startsWith("--")
  );

  const characters = code.length;

  const words =
    code.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];

  return {
    lines: lines.length,
    nonEmptyLines: nonEmptyLines.length,
    commentLines: commentLines.length,
    characters,
    identifiers: new Set(words).size,
  };
}

function formatMetrics(metrics) {
  return [
    "Deorbit Metrics",
    "───────────────",
    `Lines: ${metrics.lines}`,
    `Non-empty lines: ${metrics.nonEmptyLines}`,
    `Comment lines: ${metrics.commentLines}`,
    `Characters: ${metrics.characters}`,
    `Unique identifiers: ${metrics.identifiers}`,
  ].join("\n");
}

module.exports = {
  calculateMetrics,
  formatMetrics,
};