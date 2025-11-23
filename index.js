//alrighty boyo lets go
import fs from "fs";
import foundrybotid from "./gamebotid.js";
import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import {
  addPoints,
  addComPointsToMentions,
  getAllPoints,
  getPoints,
  getAllComPoints,
} from "./points.js";
import { itemValues } from "./itemValues.js";
dotenv.config();
//REMEMBER BOT ID IS NOT CORRECT YET
const dropbotid = foundrybotid;
const adminsFile = "./adminId.json";
let admins = { admins: [] };
if (fs.existsSync(adminsFile)) {
  admins = JSON.parse(fs.readFileSync(adminsFile, "utf8"));
}

//check for admin
function isAdmin(userid) {
  return admins.admins.includes(userid);
}
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
  if (message.webhookId || isAdmin(message.author.id)) {
    const boldMatches = message.content.match(/\*\*(.*?)\*\*/g);

    if (boldMatches && boldMatches.length >= 2) {
      let boldText = boldMatches.map((b) => b.replace(/\*\*/g, "").trim());

      boldText = boldText.filter((b) => !/coins/i.test(b));

      const username = boldText[0];

      const itemName = boldText.slice(1).join(" ");

      addPoints(username, itemName);

      const pointsAdded = itemValues[itemName.toLowerCase()] || 0;

      if (pointsAdded !== 0) {
        message.reply(
          `Awarded ${pointsAdded} points (${itemName}) to ${username}`
        );
      }
      if (pointsAdded == 0) {
        message.react("✅");
      }
      return;
    }
  }
});

//add community points
client.on("messageCreate", (message) => {
  if (!message.content.startsWith("!addcpoint") || !isAdmin(message.author.id))
    return;

  const args = message.content.split(" ");
  const amount = parseInt(args[1], 10);

  if (isNaN(amount)) {
    message.reply("⚠️ Please provide a valid number amount.");
    return;
  }

  addComPointsToMentions(message, amount);
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

    let leaderboardText = "** Foundry Point Leaderboard **\n\n";

    for (const [user, points] of entries) {
      leaderboardText += `**${user}** — ${points} points\n`;
    }

    message.reply(leaderboardText);
  }
});

//community leaderboard
client.on("messageCreate", async (message) => {
  if (message.content !== "!comleaderboard") return;

  const allPoints = getAllComPoints();
  const entries = Object.entries(allPoints);
  if (message.content === "!comleaderboard") {
    if (entries.length === 0) {
      return message.reply("No points!");
    }

    entries.sort((a, b) => b[1] - a[1]);

    let leaderboardText = "** Community Point Leaderboard **\n\n";

    for (const [user, points] of entries) {
      leaderboardText += `**${user}** — ${points} points\n`;
    }

    message.reply(leaderboardText);
  }
});
//show points

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

    message.reply(
      `${username} has ${total[0]} Foundry points and ${total[1]} Community points.`
    );
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
