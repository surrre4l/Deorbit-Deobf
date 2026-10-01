function analyzeControlFlow(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const count = (pattern) => {
    return (code.match(pattern) || []).length;
  };

  const result = {
    ifStatements: count(/\bif\b/g),
    elseifStatements: count(/\belseif\b/g),
    elseStatements: count(/\belse\b/g),
    forLoops: count(/\bfor\b/g),
    whileLoops: count(/\bwhile\b/g),
    repeatLoops: count(/\brepeat\b/g),
    functions: count(/\bfunction\b/g),
    returns: count(/\breturn\b/g),
    breaks: count(/\bbreak\b/g),
    continues: count(/\bcontinue\b/g),
    protectedCalls: count(/\bpcall\s*\(/g),
    coroutines: count(/\bcoroutine\./g),
  };

  result.branches =
    result.ifStatements +
    result.elseifStatements +
    result.elseStatements;

  result.loops =
    result.forLoops +
    result.whileLoops +
    result.repeatLoops;

  result.controlFlowScore =
    result.branches +
    result.loops +
    result.functions +
    result.protectedCalls;

  return result;
}

function formatControlFlow(result) {
  return [
    `If statements: ${result.ifStatements}`,
    `Elseif statements: ${result.elseifStatements}`,
    `Else statements: ${result.elseStatements}`,
    `For loops: ${result.forLoops}`,
    `While loops: ${result.whileLoops}`,
    `Repeat loops: ${result.repeatLoops}`,
    `Functions: ${result.functions}`,
    `Returns: ${result.returns}`,
    `Breaks: ${result.breaks}`,
    `Continues: ${result.continues}`,
    `Protected calls: ${result.protectedCalls}`,
    `Coroutines: ${result.coroutines}`,
    `Branches: ${result.branches}`,
    `Loops: ${result.loops}`,
    `Control-flow score: ${result.controlFlowScore}`,
  ].join("\n");
}

module.exports = {
  analyzeControlFlow,
  formatControlFlow,
};