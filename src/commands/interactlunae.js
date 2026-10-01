const {
  SlashCommandBuilder,
} = require("discord.js");

const {
  askLunae,
} = require("../lunae");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("interactlunae")
    .setDescription("Send a message to Lunae")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message to send to Lunae")
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString("message");

    await interaction.deferReply();

    try {
      const response = await askLunae(message);

      await interaction.editReply(
        `🌙 **Lunae**\n\n${response}`
      );
    } catch (error) {
      console.error("Lunae interaction error:", error);

      await interaction.editReply(
        `❌ Lunae integration is unavailable: ${error.message}`
      );
    }
  },
};