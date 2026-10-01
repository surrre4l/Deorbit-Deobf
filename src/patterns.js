function analyzePatterns(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const findings = [];

  const checks = [
    {
      pattern: /loadstring\s*\(/g,
      name: "Dynamic code loading",
      description: "Uses loadstring to construct or load Lua code dynamically.",
    },
    {
      pattern: /load\s*\(/g,
      name: "Dynamic loader",
      description: "Uses Lua's load function.",
    },
    {
      pattern: /string\.char\s*\(/g,
      name: "Character construction",
      description: "Builds strings from character codes.",
    },
    {
      pattern: /string\.byte\s*\(/g,
      name: "Byte extraction",
      description: "Reads numeric byte values from strings.",
    },
    {
      pattern: /string\.reverse\s*\(/g,
      name: "String reversal",
      description: "Reverses strings programmatically.",
    },
    {
      pattern: /string\.sub\s*\(/g,
      name: "String slicing",
      description: "Extracts portions of strings dynamically.",
    },
    {
      pattern: /table\.concat\s*\(/g,
      name: "Table concatenation",
      description: "Combines table elements into a string.",
    },
    {
      pattern: /HttpGet\s*\(/g,
      name: "Remote source retrieval",
      description: "Retrieves content through an HTTP-related API.",
    },
    {
      pattern: /HttpService/g,
      name: "HTTP service usage",
      description: "References Roblox HttpService.",
    },
  ];

  for (const check of checks) {
    const matches = code.match(check.pattern);

    if (!matches || matches.length === 0) {
      continue;
    }

    findings.push({
      name: check.name,
      count: matches.length,
      description: check.description,
    });
  }

  return findings;
}

function formatPatternAnalysis(findings) {
  if (!findings.length) {
    return "No notable dynamic or transformation patterns detected.";
  }

  return findings
    .map(
      (finding) =>
        `${finding.name} (${finding.count})\n  ${finding.description}`
    )
    .join("\n\n");
}

module.exports = {
  analyzePatterns,
  formatPatternAnalysis,
};