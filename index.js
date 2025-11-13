//alrighty boyo lets go
import foundrybotid from "./gamebotid.js";
import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";

dotenv.config();
const dropbotid = foundrybotid;

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

//EVERYTHING BELOW ARE TEST CASES
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

    //reply or react when bold text is found
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

client.on("messageCreate", async (message) => {
  if (message.content === "!usertest") {
    console.log(message.user);
    message.reply(`User: ${message.author.username}  Id: ${message.author.id}`);
    return;
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "thank you bot") {
    message.reply(`You got it ${message.author.username}`);
  }
  return;
});
client.login(process.env.TOKEN);

client.on("messageCreate", async (message) => {
  if (message.content !== "!verify") return;
  if (message.content === "!verify" && message.author.id === dropbotid) {
    message.reply(`You are tha BOIIIIIII`);
    return;
  } else {
    message.reply(`FALSE BOI DETECTED`);
    return;
  }
});
