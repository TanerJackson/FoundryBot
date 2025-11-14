//alrighty boyo lets go
import foundrybotid from "./gamebotid.js";
import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { addPoints, getAllPoints } from "./points.js";

dotenv.config();
//REMEMBER BOT ID IS NOT CORRECT YET
const dropbotid = foundrybotid;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", () => {
  console.log(`Bot ready to go, logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === dropbotid) {
    const boldMatches = message.content.match(/\*\*(.*?)\*\*/g);
    if (boldMatches) {
      const boldText = boldMatches.map((b) => b.replace(/\*\*/g, "").trim());

      const username = boldText[0];
      const amount = Number(boldText[1]);

      if (isNaN(amount)) {
        message.reply("⚠️ Invalid point amount:", boldText[1]);
        return;
      }

      addPoints(username, amount);
      message.reply(`Awarded ${amount} points to ${username}`);
    }
  }
});

//leaderboard
client.on("messageCreate", async (message) => {
  if (message.content !== "!leaderboard") return;

  const allPoints = getAllPoints();
  const entries = Object.entries(allPoints);
  if (message.content === "!leaderboard") {
    if (entries.length === 0) {
      return message.reply("No points!");
    }

    entries.sort((a, b) => b[1] - a[1]);

    let leaderboardText = "** Leaderboard **\n\n";

    for (const [user, points] of entries) {
      leaderboardText += `**${user}** — ${points} points\n`;
    }

    message.reply(leaderboardText);
  }
});
//EVERYTHING BELOW ARE TEST CASES

client.on("messageCreate", async (message) => {
  if (message.content === "thank you bot") {
    message.reply(`You got it ${message.author.username}`);
  }
  return;
});

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

client.login(process.env.TOKEN);
