function analyzeLua(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const lines = code.split(/\r?\n/);

  const functions = [];
  const locals = [];
  const services = [];

  for (const line of lines) {
    const functionMatch = line.match(
      /\bfunction\s+([A-Za-z_][A-Za-z0-9_%.]*)/
    );

    if (functionMatch) {
      functions.push(functionMatch[1]);
    }

    const localMatch = line.match(
      /^\s*local\s+([A-Za-z_][A-Za-z0-9_]*)/
    );

    if (localMatch) {
      locals.push(localMatch[1]);
    }

    const serviceMatch = line.match(
      /GetService\s*\(\s*["']([^"']+)["']\s*\)/
    );

    if (serviceMatch) {
      services.push(serviceMatch[1]);
    }
  }

  return {
    lineCount: lines.length,
    functions: [...new Set(functions)],
    locals: [...new Set(locals)],
    services: [...new Set(services)],
  };
}

function formatAnalysis(result) {
  return [
    `Lines: ${result.lineCount}`,
    `Functions: ${result.functions.length}`,
    `Local variables: ${result.locals.length}`,
    `Services: ${result.services.length}`,
  ].join("\n");
}

module.exports = {
  analyzeLua,
  formatAnalysis,
};