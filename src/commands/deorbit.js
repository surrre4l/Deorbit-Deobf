const {
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");

const {
  formatLua,
} = require("../formatter");

const {
  analyzeLuaSource,
  formatLuaAnalysis,
} = require("../lua-engine");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deorbit")
    .setDescription("Deorbit Lua analysis tools")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("format")
        .setDescription("Format Lua source")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Lua source code")
            .setRequired(false)
        )
        .addAttachmentOption((option) =>
          option
            .setName("file")
            .setDescription("Lua or TXT file")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("analyze")
        .setDescription("Analyze Lua source")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Lua source code")
            .setRequired(false)
        )
        .addAttachmentOption((option) =>
          option
            .setName("file")
            .setDescription("Lua or TXT file")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("help")
        .setDescription("Show Deorbit commands")
    ),

  async execute(interaction) {
    const subcommand =
      interaction.options.getSubcommand();

    if (subcommand === "help") {
      await interaction.reply(
        [
          "**Deorbit**",
          "",
          "`/deorbit format` — Format Lua source",
          "`/deorbit analyze` — Analyze Lua source",
          "`/deorbit help` — Show this help",
        ].join("\n")
      );

      return;
    }

    const code =
      interaction.options.getString("code");

    const file =
      interaction.options.getAttachment("file");

    if (!code && !file) {
      await interaction.reply(
        "Provide Lua code or attach a `.lua`/`.txt` file."
      );

      return;
    }

    await interaction.deferReply();

    let source = code;

    if (!source && file) {
      const response =
        await fetch(file.url);

      if (!response.ok) {
        throw new Error(
          `Unable to download attachment: HTTP ${response.status}`
        );
      }

      source = await response.text();
    }

    if (!source.trim()) {
      throw new Error("The Lua source is empty.");
    }

    if (subcommand === "format") {
      const formatted =
        formatLua(source);

      const attachment =
        new AttachmentBuilder(
          Buffer.from(formatted, "utf8"),
          {
            name: "deorbit_formatted.lua",
          }
        );

      await interaction.editReply({
        content: "Formatted Lua source:",
        files: [attachment],
      });

      return;
    }

    if (subcommand === "analyze") {
      const result =
        analyzeLuaSource(source);

      await interaction.editReply(
        `\`\`\`\n${formatLuaAnalysis(result)}\n\`\`\``
      );
    }
  },
};