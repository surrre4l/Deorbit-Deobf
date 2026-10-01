function analyzeLua(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const lines = code.split(/\r?\n/);

  const functions = [];
  const locals = [];
  const globals = [];
  const services = [];
  const requires = [];
  const returns = [];
  const tables = [];

  const seen = {
    functions: new Set(),
    locals: new Set(),
    globals: new Set(),
    services: new Set(),
    requires: new Set(),
    returns: new Set(),
    tables: new Set(),
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("--")) {
      continue;
    }

    // Function declarations
    const functionMatch = line.match(
      /\bfunction\s+([A-Za-z_][A-Za-z0-9_%.:]*)/
    );

    if (functionMatch) {
      const name = functionMatch[1];

      if (!seen.functions.has(name)) {
        seen.functions.add(name);
        functions.push(name);
      }
    }

    // Local declarations
    const localMatch = line.match(
      /^\s*local\s+([A-Za-z_][A-Za-z0-9_]*)/
    );

    if (localMatch) {
      const name = localMatch[1];

      if (!seen.locals.has(name)) {
        seen.locals.add(name);
        locals.push(name);
      }
    }

    // Global assignments
    const globalMatch = line.match(
      /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*/
    );

    if (globalMatch && !line.startsWith("local ")) {
      const name = globalMatch[1];

      if (!seen.globals.has(name)) {
        seen.globals.add(name);
        globals.push(name);
      }
    }

    // Roblox services
    const serviceRegex =
      /GetService\s*\(\s*["']([^"']+)["']\s*\)/g;

    let serviceMatch;

    while ((serviceMatch = serviceRegex.exec(line)) !== null) {
      const service = serviceMatch[1];

      if (!seen.services.has(service)) {
        seen.services.add(service);
        services.push(service);
      }
    }

    // require(...)
    const requireRegex =
      /\brequire\s*\(\s*([^)]*)\)/g;

    let requireMatch;

    while ((requireMatch = requireRegex.exec(line)) !== null) {
      const target = requireMatch[1].trim();

      if (!seen.requires.has(target)) {
        seen.requires.add(target);
        requires.push(target);
      }
    }

    // return statements
    const returnMatch = line.match(
      /^return\b(.*)$/
    );

    if (returnMatch) {
      const value = returnMatch[1].trim() || "(nothing)";

      if (!seen.returns.has(value)) {
        seen.returns.add(value);
        returns.push(value);
      }
    }

    // Simple table declarations
    const tableMatch = line.match(
      /^\s*(?:local\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{/
    );

    if (tableMatch) {
      const name = tableMatch[1];

      if (!seen.tables.has(name)) {
        seen.tables.add(name);
        tables.push(name);
      }
    }
  }

  return {
    lineCount: lines.length,
    functions,
    locals,
    globals,
    services,
    requires,
    returns,
    tables,
  };
}

function formatAnalysis(result) {
  return [
    `Lines: ${result.lineCount}`,
    `Functions: ${result.functions.length}`,
    `Local variables: ${result.locals.length}`,
    `Global assignments: ${result.globals.length}`,
    `Services: ${result.services.length}`,
    `Requires: ${result.requires.length}`,
    `Return statements: ${result.returns.length}`,
    `Tables: ${result.tables.length}`,
  ].join("\n");
}

module.exports = {
  analyzeLua,
  formatAnalysis,
};