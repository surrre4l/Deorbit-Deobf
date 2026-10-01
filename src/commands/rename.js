const {
  SlashCommandBuilder,
} = require("discord.js");

function suggestNames(code) {
  const suggestions = [];

  const localPattern =
    /\blocal\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)/g;

  let match;

  while ((match = localPattern.exec(code)) !== null) {
    const name = match[1];
    const value = match[2].trim();

    if (/^(v\d+|var\d+|local\d+|l\d+|x\d+|a\d+|b\d+)$/i.test(name)) {
      let suggested = "value";

      if (/GetService\s*\(/.test(value)) {
        suggested = "service";
      } else if (/Players|LocalPlayer/.test(value)) {
        suggested = "player";
      } else if (/Character/.test(value)) {
        suggested = "character";
      } else if (/function/.test(value)) {
        suggested = "handler";
      } else if (/true|false/.test(value)) {
        suggested = "enabled";
      } else if (/["']/.test(value)) {
        suggested = "text";
      }

      suggestions.push({
        original: name,
        suggested,
      });
    }
  }

  return suggestions;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rename")
    .setDescription("Suggest readable names for Lua variables")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Lua code to analyze")
        .setRequired(true)
    ),

  async execute(interaction) {
    const code = interaction.options.getString("code");

    await interaction.deferReply();

    const suggestions = suggestNames(code);

    if (!suggestions.length) {
      await interaction.editReply(
        "🌑 No obvious obfuscated variable names were detected."
      );
      return;
    }

    const output = suggestions
      .map(
        ({ original, suggested }) =>
          `\`${original}\` → \`${suggested}\``
      )
      .join("\n");

    await interaction.editReply(
      [
        "🌑 **Deorbit Rename Analysis**",
        "",
        output,
        "",
        "These are suggestions only; the original code has not been modified.",
      ].join("\n")
    );
  },
};