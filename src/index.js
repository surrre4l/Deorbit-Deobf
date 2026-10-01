const http = require("http");

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
} = require("discord.js");

const {
  discordToken,
  clientId,
  guildId,
} = require("./config");

const {
  loadCommands,
} = require("./commands");

const {
  handleCommand,
} = require("./commands/router");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ==========================================
// RENDER HEALTH SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "online",
        service: "Deorbit AI",
        version: "1.0.0",
        discord: client.isReady() ? "connected" : "connecting",
      })
    );

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      error: "Not found",
    })
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Deorbit health server listening on port ${PORT}`);
});

// ==========================================
// DISCORD COMMAND REGISTRATION
// ==========================================

async function registerCommands() {
  const commands = loadCommands();

  const commandData = Array.from(commands.values()).map((command) =>
    command.data.toJSON()
  );

  const rest = new REST({ version: "10" }).setToken(discordToken);

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    {
      body: commandData,
    }
  );

  console.log(
    `Registered ${commandData.length} Deorbit command(s).`
  );
}

// ==========================================
// DISCORD READY
// ==========================================

client.once("clientReady", async () => {
  console.log(`Deorbit is online as ${client.user.tag}`);

  try {
    await registerCommands();
  } catch (error) {
    console.error(
      "Failed to register Deorbit commands:",
      error
    );
  }
});

// ==========================================
// INTERACTIONS
// ==========================================

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  try {
    const handled = await handleCommand(interaction, {});

    if (
      !handled &&
      !interaction.replied &&
      !interaction.deferred
    ) {
      await interaction.reply(
        "Unknown Deorbit command."
      );
    }
  } catch (error) {
    console.error("Interaction error:", error);

    const message =
      "❌ Something went wrong while processing Deorbit.";

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(message);
    } else {
      await interaction.reply(message);
    }
  }
});

// ==========================================
// START DISCORD
// ==========================================

client.login(discordToken);