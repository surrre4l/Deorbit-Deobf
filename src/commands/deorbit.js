const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deorbit")
    .setDescription("Deorbit AI tools")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("deobf")
        .setDescription("Analyze authorized Lua code")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Lua code to analyze")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("interactlunae")
        .setDescription("Interact with Lunae")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message for Lunae")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("help")
        .setDescription("Show Deorbit help")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rename")
        .setDescription("Suggest readable Lua names")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Lua code to analyze")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === "help") {
      return interaction.reply(
        "🌑 **Deorbit AI**\n\n" +
        "`/deorbit deobf` — Analyze authorized Lua code\n" +
        "`/deorbit interactlunae` — Interact with Lunae\n" +
        "`/deorbit help` — Show help\n" +
        "`/deorbit rename` — Suggest readable names"
      );
    }

    if (command === "deobf") {
      return interaction.reply(
        "🌑 Deorbit's deobfuscation engine is not connected yet."
      );
    }

    if (command === "interactlunae") {
      return interaction.reply(
        "🌙 Lunae integration is not connected yet."
      );
    }

    if (command === "rename") {
      return interaction.reply(
        "🌑 Deorbit's rename engine is not connected yet."
      );
    }
  },
};