const { SlashCommandBuilder } = require("discord.js");

const {
  analyzeLua,
  formatAnalysis,
} = require("../analyzer");

const {
  suggestNames,
  formatRenameSuggestions,
} = require("../rename");

const {
  formatLua,
} = require("../formatter");

const {
  diagnoseLua,
  formatDiagnostics,
} = require("../diagnostics");

const {
  calculateMetrics,
  formatMetrics,
} = require("../metrics");

const {
  analyzeTokens,
  formatTokenAnalysis,
} = require("../tokens");

const {
  analyzeControlFlow,
  formatControlFlow,
} = require("../controlflow");

const {
  analyzeRoblox,
  formatRobloxAnalysis,
} = require("../roblox");

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
        .setName("rename")
        .setDescription("Suggest readable Lua names")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Lua code to analyze")
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("format")
        .setDescription("Format readable Lua code")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Lua code to format")
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
          "`/deorbit format` — Format Lua code",
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
        const diagnostics = diagnoseLua(code);
        const metrics = calculateMetrics(code);
        const tokens = analyzeTokens(code);
        const controlFlow = analyzeControlFlow(code);
        const roblox = analyzeRoblox(code);

        await interaction.editReply(
          [
            "🌑 **Deorbit Analysis**",
            "",
            "**Structure**",
            "```text",
            formatAnalysis(result),
            "```",
            "",
            "**Diagnostics**",
            "```text",
            formatDiagnostics(diagnostics),
            "```",
            "",
            "**Metrics**",
            "```text",
            formatMetrics(metrics),
            "```",
            "",
            "**Tokens**",
            "```text",
            formatTokenAnalysis(tokens),
            "```",
            "",
            "**Control Flow**",
            "```text",
            formatControlFlow(controlFlow),
            "```",
            "",
            "**Roblox Analysis**",
            "```text",
            formatRobloxAnalysis(roblox),
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
            "",
            `**Issues:** ${diagnostics.length}`,
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
      const code = interaction.options.getString("code");

      await interaction.deferReply();

      try {
        const suggestions = suggestNames(code);

        await interaction.editReply(
          [
            "🌑 **Deorbit Rename Analysis**",
            "",
            "```text",
            formatRenameSuggestions(suggestions),
            "```",
            "",
            `**Suggestions:** ${suggestions.length}`,
          ].join("\n")
        );
      } catch (error) {
        console.error(error);

        await interaction.editReply(
          `❌ Rename analysis failed: ${error.message}`
        );
      }

      return;
    }

    if (subcommand === "format") {
      const code = interaction.options.getString("code");

      await interaction.deferReply();

      try {
        const formatted = formatLua(code);
        const maxLength = 1800;

        const output =
          formatted.length > maxLength
            ? `${formatted.slice(0, maxLength)}\n-- Output truncated`
            : formatted;

        await interaction.editReply(
          [
            "🌑 **Deorbit Lua Formatter**",
            "",
            "```lua",
            output,
            "```",
          ].join("\n")
        );
      } catch (error) {
        console.error(error);

        await interaction.editReply(
          `❌ Formatting failed: ${error.message}`
        );
      }

      return;
    }

    if (subcommand === "interactlunae") {
      await interaction.reply(
        "🌙 Lunae integration will be connected next."
      );

      return;
    }
  },
};