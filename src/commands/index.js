const {
  Client,
  GatewayIntentBits,
} = require("discord.js");

const {
  discordToken,
} = require("./config");

const {
  handleCommand,
} = require("./commands/router");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("clientReady", () => {
  console.log(`Deorbit is online as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const handled = await handleCommand(interaction, {});

    if (!handled && !interaction.replied && !interaction.deferred) {
      await interaction.reply("Unknown Deorbit command.");
    }
  } catch (error) {
    console.error("Interaction error:", error);

    const message = "❌ Something went wrong while processing Deorbit.";

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(message);
    } else {
      await interaction.reply(message);
    }
  }
});

client.login(discordToken);