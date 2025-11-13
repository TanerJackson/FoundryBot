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
  if (message.content === "!test2") {
    message.reply("biiiiiiig shoosh");
    message.react(":white_check_mark:");
    return;
  }
  if (message.content === "!test3") {
    message.react("✅");
  }
});

client.on("messageCreate", async (message) => {
  // Match any text surrounded by double asterisks (**bold**)
  const boldMatches = message.content.match(/\*\*(.*?)\*\*/g);

  if (boldMatches) {
    // Extract the bold text (without the **)
    const boldText = boldMatches.map((b) => b.replace(/\*\*/g, ""));

    console.log("Bold text found:", boldText);

    // reply or react when bold text is found
    await message.react("✅");
    await message.reply(
      `Bold text used in your message: ${boldText.join(", ")}`
    );
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "!slashtest") {
    message.reply("!richest");
    return;
  }
});
client.login(process.env.TOKEN);
