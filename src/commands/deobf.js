const {
  SlashCommandBuilder,
} = require("discord.js");

const {
  analyzeLua,
  formatAnalysis,
} = require("../analyzer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deobf")
    .setDescription("Analyze authorized Lua code")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Lua code to analyze")
        .setRequired(true)
    ),

  async execute(interaction) {
    const code = interaction.options.getString("code");

    await interaction.deferReply();

    try {
      const analysis = analyzeLua(code);

      await interaction.editReply(
        [
          "🌑 **Deorbit Analysis**",
          "",
          "```text",
          formatAnalysis(analysis),
          "```",
          "",
          "**Functions:**",
          analysis.functions.length
            ? analysis.functions.join(", ")
            : "None detected",
          "",
          "**Services:**",
          analysis.services.length
            ? analysis.services.join(", ")
            : "None detected",
        ].join("\n")
      );
    } catch (error) {
      console.error("Deobf error:", error);
      await interaction.editReply(
        `❌ ${error.message}`
      );
    }
  },
};