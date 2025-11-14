//alrighty boyo lets go
import foundrybotid from "./gamebotid.js";
import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { addPoints, getAllPoints, getPoints } from "./points.js";
import { itemValues } from "./itemValues.js";
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

//add points on bot post
client.on("messageCreate", async (message) => {
  if (message.author.id === dropbotid) {
    const boldMatches = message.content.match(/\*\*(.*?)\*\*/g);

    if (boldMatches && boldMatches.length >= 2) {
      const boldText = boldMatches.map((b) => b.replace(/\*\*/g, "").trim());

      const username = boldText[0];

      const itemName = boldText.slice(1).join(" ");

      addPoints(username, itemName);

      const pointsAdded = itemValues[itemName.toLowerCase()] || 0;

      message.reply(
        `Awarded ${pointsAdded} points (${itemName}) to ${username}`
      );
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

//get own points

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!points")) {
    let targetMember;

    if (message.mentions.members.size > 0) {
      targetMember = message.mentions.members.first();
    } else {
      targetMember = message.member;
    }
    const username = targetMember.displayName;
    const total = getPoints(username);
    message.reply(`${username} has ${total} points.`);
  }
});
//EVERYTHING BELOW ARE TEST CASES
client.on("messageCreate", async (message) => {
  if (message.content === "!userinfo") {
    console.log(message.author); // Full User object
    //console.log(message.member); // Full GuildMember object
    message.reply("@TigerShrimp check the logs");
  }
});

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
