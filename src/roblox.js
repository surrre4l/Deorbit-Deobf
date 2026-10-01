function analyzeRoblox(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const services = new Set();
  const patterns = new Set();

  const serviceRegex =
    /GetService\s*\(\s*["']([^"']+)["']\s*\)/g;

  let match;

  while ((match = serviceRegex.exec(code)) !== null) {
    services.add(match[1]);
  }

  const knownPatterns = [
    {
      pattern: /game\.Players\.LocalPlayer/,
      name: "LocalPlayer",
    },
    {
      pattern: /LocalPlayer\.Character/,
      name: "Player Character",
    },
    {
      pattern: /UserInputService/,
      name: "User Input",
    },
    {
      pattern: /RunService/,
      name: "Run Service",
    },
    {
      pattern: /TweenService/,
      name: "Tween Service",
    },
    {
      pattern: /HttpService/,
      name: "HTTP Service",
    },
    {
      pattern: /ReplicatedStorage/,
      name: "Replicated Storage",
    },
    {
      pattern: /RemoteEvent/,
      name: "Remote Event",
    },
    {
      pattern: /RemoteFunction/,
      name: "Remote Function",
    },
    {
      pattern: /FireServer\s*\(/,
      name: "Remote Event Invocation",
    },
    {
      pattern: /InvokeServer\s*\(/,
      name: "Remote Function Invocation",
    },
    {
      pattern: /FindFirstChild\s*\(/,
      name: "Instance Child Lookup",
    },
  ];

  for (const item of knownPatterns) {
    if (item.pattern.test(code)) {
      patterns.add(item.name);
    }
  }

  return {
    services: [...services],
    patterns: [...patterns],
  };
}

function formatRobloxAnalysis(result) {
  return [
    `Services detected: ${result.services.length}`,
    result.services.length
      ? `  ${result.services.join(", ")}`
      : "  None",

    `Patterns detected: ${result.patterns.length}`,
    result.patterns.length
      ? `  ${result.patterns.join(", ")}`
      : "  None",
  ].join("\n");
}

module.exports = {
  analyzeRoblox,
  formatRobloxAnalysis,
};