const {
  Client,
  GatewayIntentBits,
} = require("discord.js");

const {
  discordToken,
} = require("./config");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("clientReady", () => {
  console.log(`Deorbit is online as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "deorbit") {
    await interaction.reply(
      "🌑 Deorbit is online. Use `/deorbit help` to see my commands."
    );
  }
});

client.login(discordToken);