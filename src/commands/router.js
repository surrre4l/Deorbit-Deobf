const { loadCommands } = require("./index");

const commands = loadCommands();

async function handleCommand(interaction, services) {
  const command = commands.get(interaction.commandName);

  if (!command) {
    return false;
  }

  await command.execute(interaction, services);
  return true;
}

module.exports = {
  handleCommand,
};