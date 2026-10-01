const {
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");

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

const {
  analyzePatterns,
  formatPatternAnalysis,
} = require("../patterns");

async function downloadAttachment(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download attachment: HTTP ${response.status}`
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

function getOutputName(originalName) {
  const baseName = originalName
    .replace(/\.(lua|txt)$/i, "")
    .replace(/[^\w.-]+/g, "_");

  return `${baseName}_DEOBFUSCATED.TXT`;
}

function buildAnalysisFile(code, originalName) {
  const result = analyzeLua(code);
  const diagnostics = diagnoseLua(code);
  const metrics = calculateMetrics(code);
  const tokens = analyzeTokens(code);
  const controlFlow = analyzeControlFlow(code);
  const roblox = analyzeRoblox(code);
  const patterns = analyzePatterns(code);
  const renameSuggestions = suggestNames(code);

  // Static-analysis output.
  // This does not execute or bypass protected code.
  const formattedCode = formatLua(code);

  return [
    `DEORBIT ANALYSIS`,
    `================`,
    ``,
    `Source: ${originalName}`,
    `Generated: ${new Date().toISOString()}`,
    ``,

    `STRUCTURE`,
    `---------`,
    formatAnalysis(result),
    ``,

    `DIAGNOSTICS`,
    `-----------`,
    formatDiagnostics(diagnostics),
    ``,

    `METRICS`,
    `-------`,
    formatMetrics(metrics),
    ``,

    `TOKENS`,
    `------`,
    formatTokenAnalysis(tokens),
    ``,

    `CONTROL FLOW`,
    `------------`,
    formatControlFlow(controlFlow),
    ``,

    `ROBLOX ANALYSIS`,
    `---------------`,
    formatRobloxAnalysis(roblox),
    ``,

    `PATTERN ANALYSIS`,
    `----------------`,
    formatPatternAnalysis(patterns),
    ``,

    `RENAME SUGGESTIONS`,
    `------------------`,
    formatRenameSuggestions(renameSuggestions),
    ``,

    `FORMATTED LUA`,
    `-------------`,
    formattedCode,
    ``,

    `END OF DEORBIT REPORT`,
  ].join("\n");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deorbit")
    .setDescription("Deorbit AI Lua analysis tools")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("deobf")
        .setDescription("Analyze an authorized Lua file or code")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Lua code to analyze")
            .setRequired(false)
        )
        .addAttachmentOption((option) =>
          option
            .setName("file")
            .setDescription("Upload a .lua or .txt Lua file")
            .setRequired(false)
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
          "`/deorbit deobf` — Analyze Lua code or upload a file",
          "`/deorbit rename` — Suggest readable names",
          "`/deorbit format` — Format Lua code",
          "`/deorbit interactlunae` — Interact with Lunae",
          "`/deorbit help` — Show this help",
          "",
          "**Supported files:** `.lua`, `.txt`",
          "**Output:** `NAME_DEOBFUSCATED.TXT`",
        ].join("\n")
      );

      return;
    }

    if (subcommand === "deobf") {
      const code = interaction.options.getString("code");
      const file = interaction.options.getAttachment("file");

      if (!code && !file) {
        await interaction.reply(
          "❌ Provide Lua code or upload a `.lua`/`.txt` file."
        );

        return;
      }

      if (code && file) {
        await interaction.reply(
          "❌ Provide either code or a file, not both."
        );

        return;
      }

      await interaction.deferReply();

      try {
        let sourceCode;
        let sourceName;

        if (file) {
          const extension = file.name
            .split(".")
            .pop()
            ?.toLowerCase();

          if (extension !== "lua" && extension !== "txt") {
            await interaction.editReply(
              "❌ Only `.lua` and `.txt` files are supported."
            );

            return;
          }

          sourceCode = (
            await downloadAttachment(file.url)
          ).toString("utf8");

          sourceName = file.name;
        } else {
          sourceCode = code;
          sourceName = "code_input.lua";
        }

        if (!sourceCode.trim()) {
          await interaction.editReply(
            "❌ The supplied Lua source is empty."
          );

          return;
        }

        const report = buildAnalysisFile(
          sourceCode,
          sourceName
        );

        const outputName = getOutputName(sourceName);

        const attachment = new AttachmentBuilder(
          Buffer.from(report, "utf8"),
          {
            name: outputName,
            description:
              "Deorbit static Lua analysis report",
          }
        );

        await interaction.editReply({
          content:
            `🌑 **Deorbit finished analyzing \`${sourceName}\`.**\n` +
            `📄 Output: \`${outputName}\``,
          files: [attachment],
        });
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