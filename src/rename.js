function suggestNames(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const suggestions = [];

  const patterns = [
    {
      regex: /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*game:GetService\(\s*["']([^"']+)["']\s*\)/g,
      create: (name, service) => ({
        original: name,
        suggestion: service,
        reason: `References the ${service} service.`,
      }),
    },
    {
      regex: /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*game:GetService\(\s*["']Players["']\s*\)\.LocalPlayer/g,
      create: (name) => ({
        original: name,
        suggestion: "localPlayer",
        reason: "References the local Roblox player.",
      }),
    },
    {
      regex: /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*game:GetService\(\s*["']RunService["']\s*\)/g,
      create: (name) => ({
        original: name,
        suggestion: "runService",
        reason: "References Roblox RunService.",
      }),
    },
  ];

  for (const pattern of patterns) {
    let match;

    while ((match = pattern.regex.exec(code)) !== null) {
      const name = match[1];
      const suggestion = pattern.create(name, match[2]);

      if (name !== suggestion.suggestion) {
        suggestions.push(suggestion);
      }
    }
  }

  const genericVariables =
    /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g;

  let match;

  while ((match = genericVariables.exec(code)) !== null) {
    const name = match[1];

    if (
      /^v\d+$/i.test(name) ||
      /^var\d+$/i.test(name) ||
      /^local\d+$/i.test(name)
    ) {
      suggestions.push({
        original: name,
        suggestion: `value${suggestions.length + 1}`,
        reason: "Generic variable name; inspect its assigned value.",
      });
    }
  }

  const seen = new Set();

  return suggestions.filter((item) => {
    const key = `${item.original}:${item.suggestion}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function formatRenameSuggestions(suggestions) {
  if (!suggestions.length) {
    return "No obvious rename suggestions found.";
  }

  return suggestions
    .map(
      (item) =>
        `${item.original} -> ${item.suggestion}\n  ${item.reason}`
    )
    .join("\n\n");
}

module.exports = {
  suggestNames,
  formatRenameSuggestions,
};