const { SlashCommandBuilder } = require("discord.js");
const { analyzeLua, formatAnalysis } = require("../analyzer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deorbit")
    .setDescription("Deorbit AI Lua analysis tools")

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
        .setDescription("Show Deorbit commands")
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
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "help") {
      await interaction.reply(
        [
          "🌑 **Deorbit AI**",
          "",
          "`/deorbit deobf` — Analyze Lua code",
          "`/deorbit rename` — Suggest readable names",
          "`/deorbit interactlunae` — Interact with Lunae",
          "`/deorbit help` — Show this help",
        ].join("\n")
      );
      return;
    }

    if (subcommand === "deobf") {
      const code = interaction.options.getString("code");

      await interaction.deferReply();

      try {
        const result = analyzeLua(code);

        const output = formatAnalysis(result);

        await interaction.editReply(
          [
            "🌑 **Deorbit Analysis**",
            "",
            "```text",
            output,
            "```",
            "",
            `**Functions:** ${
              result.functions.length
                ? result.functions.join(", ")
                : "None detected"
            }`,
            "",
            `**Services:** ${
              result.services.length
                ? result.services.join(", ")
                : "None detected"
            }`,
          ].join("\n")
        );
      } catch (error) {
        console.error(error);

        await interaction.editReply(
          `❌ Analysis failed: ${error.message}`
        );
      }

      return;
    }

    if (subcommand === "rename") {
      await interaction.reply(
        "🌑 The rename engine will be connected next."
      );
      return;
    }

    if (subcommand === "interactlunae") {
      await interaction.reply(
        "🌙 Lunae integration will be connected next."
      );
    }
  },
};