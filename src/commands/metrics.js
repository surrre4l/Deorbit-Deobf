const {
  SlashCommandBuilder,
} = require("discord.js");

const {
  calculateMetrics,
  formatMetrics,
} = require("../metrics");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("metrics")
    .setDescription("Show Lua source metrics")
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
      const metrics =
        calculateMetrics(code);

      const output =
        formatMetrics(metrics);

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