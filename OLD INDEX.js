import fs from "fs";
import dotenv from "dotenv";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { getAllPoints, getAllComPoints } from "./points.js";
import { itemValues } from "./itemValues.js";
import { addPoints } from "./points.js";

dotenv.config();
//Trackscape bot id
const trackscapeID = 864626697327869952;

// LOAD ADMINS
const adminsFile = "./adminId.json";
let admins = { admins: [] };
if (fs.existsSync(adminsFile)) {
  admins = JSON.parse(fs.readFileSync(adminsFile, "utf8"));
}

function isAdmin(userId) {
  return admins.admins.includes(userId);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.isAdmin = isAdmin;

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const cmd = (await import(`./commands/${file}`)).default;
  client.commands.set(cmd.data.name, cmd);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      interaction.reply("Error executing command.");
    }
  }
});

client.on("messageCreate", async (message) => {
  if (!(message.webhookId || isAdmin(message.author.id))) return;
  if (message.webhookId === 1438057779750371503) return;
  const boldMatches = message.content.match(/\*\*(.*?)\*\*/g);
  if (!boldMatches || boldMatches.length < 2) return;
  if (message.content.toLowerCase().includes("collection log")) {
    message.react("✅");
    return;
  }
  let boldText = boldMatches.map((b) => b.replace(/\*\*/g, "").trim());
  boldText = boldText.filter((b) => !/coins/i.test(b));

  const username = boldText[0];
  const itemName = boldText.slice(1).join(" ");

  addPoints(username, itemName);

  const pointsAdded = itemValues[itemName.toLowerCase()] || 0;

  if (pointsAdded !== 0) {
    message.reply(`Awarded ${pointsAdded} points (${itemName}) to ${username}`);
  } else {
    message.react("✅");
  }
});
client.on("messageCreate", async (message) => {
  if ((message.author.id = trackscapeID)) {
    message.react("✅");
    return;
  }
  return;
});

client.login(process.env.TOKEN);
