function calculateMetrics(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const lines = code.split(/\r?\n/);

  const nonEmptyLines = lines.filter(
    (line) => line.trim().length > 0
  );

  const comments = lines.filter(
    (line) => line.trim().startsWith("--")
  );

  const functions = (
    code.match(
      /\bfunction\s+[A-Za-z_][A-Za-z0-9_.:]*/g
    ) || []
  ).length;

  const conditionals = (
    code.match(/\b(if|elseif)\b/g) || []
  ).length;

  const loops = (
    code.match(/\b(for|while|repeat)\b/g) || []
  ).length;

  const locals = (
    code.match(/\blocal\s+[A-Za-z_][A-Za-z0-9_]*/g) || []
  ).length;

  const strings = (
    code.match(/(["'])(?:\\.|(?!\1).)*\1/g) || []
  ).length;

  const estimatedComplexity =
    1 +
    conditionals +
    loops +
    Math.floor(functions / 2);

  return {
    totalLines: lines.length,
    nonEmptyLines: nonEmptyLines.length,
    commentLines: comments.length,
    functions,
    conditionals,
    loops,
    locals,
    strings,
    estimatedComplexity,
  };
}

function formatMetrics(metrics) {
  return [
    `Total lines: ${metrics.totalLines}`,
    `Non-empty lines: ${metrics.nonEmptyLines}`,
    `Comment lines: ${metrics.commentLines}`,
    `Functions: ${metrics.functions}`,
    `Conditionals: ${metrics.conditionals}`,
    `Loops: ${metrics.loops}`,
    `Local declarations: ${metrics.locals}`,
    `String literals: ${metrics.strings}`,
    `Estimated complexity: ${metrics.estimatedComplexity}`,
  ].join("\n");
}

module.exports = {
  calculateMetrics,
  formatMetrics,
};