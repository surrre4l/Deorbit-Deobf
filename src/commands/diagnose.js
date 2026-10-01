const {
  SlashCommandBuilder,
} = require("discord.js");

const {
  diagnoseLua,
  formatDiagnostics,
} = require("../diagnostics");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("diagnose")
    .setDescription("Check Lua source for obvious issues")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Lua source code")
        .setRequired(true)
    ),

  async execute(interaction) {
    const code =
      interaction.options.getString("code");

    await interaction.deferReply();

    try {
      const diagnostics =
        diagnoseLua(code);

      const output =
        formatDiagnostics(diagnostics);

      await interaction.editReply(
        `\`\`\`\n${output}\n\`\`\``
      );
    } catch (error) {
      await interaction.editReply(
        `❌ ${error.message}`
      );
    }
  },
};