//alrighty boyo lets go
const { Client, GatewayIntentBits, messageLink } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Bot ready to go, logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content === "!test1") {
    message.reply("test success");
    return;
  }
});
client.login(process.env.TOKEN);
