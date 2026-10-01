const fs = require("fs");
const path = require("path");

function loadCommands() {
  const commands = new Map();
  const commandsPath = __dirname;

  for (const file of fs.readdirSync(commandsPath)) {
    // Only load command files.
    // Do not load this loader or the router.
    if (
      !file.endsWith(".js") ||
      file === "index.js" ||
      file === "router.js"
    ) {
      continue;
    }

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (
      command &&
      command.data &&
      typeof command.data.name === "string" &&
      typeof command.execute === "function"
    ) {
      commands.set(command.data.name, command);
    }
  }

  return commands;
}

module.exports = {
  loadCommands,
};