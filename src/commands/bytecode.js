
const {
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");

const {
  readBytecode,
} = require("../bytecode/prototype");

const {
  validateBytecode,
} = require("../bytecode/validate");

const {
  disassembleBytecode,
} = require("../bytecode/disassemble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bytecode")
    .setDescription("Inspect standard Lua bytecode")
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("Lua bytecode file")
        .setRequired(true)
    ),

  async execute(interaction) {
    const file =
      interaction.options.getAttachment("file");

    await interaction.deferReply();

    try {
      if (file.size > 2 * 1024 * 1024) {
        await interaction.editReply(
          "The file is too large. Maximum size is 2 MB."
        );
        return;
      }

      const response = await fetch(file.url);

      if (!response.ok) {
        throw new Error(
          `Could not download file (HTTP ${response.status}).`
        );
      }

      const data = Buffer.from(
        await response.arrayBuffer()
      );

      if (data.length > 2 * 1024 * 1024) {
        throw new Error("The downloaded file exceeds 2 MB.");
      }

      const parsed = readBytecode(data);
      const validation = validateBytecode(parsed);

      if (!validation.valid) {
        await interaction.editReply({
          content: [
            "**Bytecode validation failed:**",
            "```",
            validation.errors.slice(0, 15).join("\n"),
            "```",
          ].join("\n"),
        });
        return;
      }

      const output = disassembleBytecode(parsed);

      const attachment = new AttachmentBuilder(
        Buffer.from(output, "utf8"),
        {
          name: "deorbit_disassembly.txt",
        }
      );

      await interaction.editReply({
        content:
          "Standard Lua bytecode inspection completed. This is a disassembly, not reconstructed source.",
        files: [attachment],
      });
    } catch (error) {
      console.error("Bytecode inspection error:", error);

      await interaction.editReply(
        `Unable to inspect bytecode: ${error.message}`
      );
    }
  },
};
