function suggestNames(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Lua code is required.");
  }

  const suggestions = [];

  const addSuggestion = (original, suggestion, reason) => {
    if (!original || !suggestion || original === suggestion) {
      return;
    }

    suggestions.push({
      original,
      suggestion,
      reason,
    });
  };

  // Roblox services
  const serviceRegex =
    /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*game:GetService\(\s*["']([^"']+)["']\s*\)/g;

  let match;

  while ((match = serviceRegex.exec(code)) !== null) {
    const name = match[1];
    const service = match[2];

    const serviceNames = {
      Players: "players",
      RunService: "runService",
      TweenService: "tweenService",
      UserInputService: "userInputService",
      ReplicatedStorage: "replicatedStorage",
      ServerStorage: "serverStorage",
      HttpService: "httpService",
      Lighting: "lighting",
      Workspace: "workspace",
      SoundService: "soundService",
      StarterGui: "starterGui",
      TeleportService: "teleportService",
    };

    addSuggestion(
      name,
      serviceNames[service] || service,
      `References the Roblox ${service} service.`
    );
  }

  // LocalPlayer
  const localPlayerRegex =
    /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*game:GetService\(\s*["']Players["']\s*\)\.LocalPlayer/g;

  while ((match = localPlayerRegex.exec(code)) !== null) {
    addSuggestion(
      match[1],
      "localPlayer",
      "References the local Roblox player."
    );
  }

  // Character
  const characterRegex =
    /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([A-Za-z_][A-Za-z0-9_]*)\.Character\b/g;

  while ((match = characterRegex.exec(code)) !== null) {
    addSuggestion(
      match[1],
      "character",
      "References a player's character."
    );
  }

  // Humanoid
  const humanoidRegex =
    /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([A-Za-z_][A-Za-z0-9_]*)[^=]*:FindFirstChild\(\s*["']Humanoid["']\s*\)/g;

  while ((match = humanoidRegex.exec(code)) !== null) {
    addSuggestion(
      match[1],
      "humanoid",
      "References a Humanoid instance."
    );
  }

  // Generic obfuscated variable names
  const genericVariables =
    /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g;

  while ((match = genericVariables.exec(code)) !== null) {
    const name = match[1];

    if (/^v\d+$/i.test(name)) {
      addSuggestion(
        name,
        `value${name.replace(/\D/g, "") || "1"}`,
        "Generic variable name; inspect its assigned value."
      );
    }

    if (/^var\d+$/i.test(name)) {
      addSuggestion(
        name,
        `variable${name.replace(/\D/g, "") || "1"}`,
        "Generic variable name; inspect its assigned value."
      );
    }

    if (/^local\d+$/i.test(name)) {
      addSuggestion(
        name,
        `localValue${name.replace(/\D/g, "") || "1"}`,
        "Generic local name; inspect its assigned value."
      );
    }

    if (/^func\d+$/i.test(name)) {
      addSuggestion(
        name,
        `function${name.replace(/\D/g, "") || "1"}`,
        "Generic function-like name; inspect what it does."
      );
    }
  }

  // Common short names
  const shortNames = /\blocal\s+([a-z])\s*=/gi;

  while ((match = shortNames.exec(code)) !== null) {
    const name = match[1];

    const replacements = {
      p: "player",
      c: "character",
      h: "humanoid",
      t: "target",
      s: "service",
      r: "result",
      i: "index",
      n: "name",
      v: "value",
    };

    if (replacements[name.toLowerCase()]) {
      addSuggestion(
        name,
        replacements[name.toLowerCase()],
        "Short variable name that may benefit from a descriptive name."
      );
    }
  }

  // Remove duplicate suggestions
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