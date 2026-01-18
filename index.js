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
  if (message.embeds?.length) {
    const embed = message.embeds[0];

    if (
      embed.title &&
      embed.title.toLowerCase().includes("new high value") &&
      embed.description
    ) {
      const text = embed.description;

      const userMatch = text.match(/^(.+?)\s+received/i);
      const itemMatch = text.match(/drop:\s*(.+?)\s*\(/i);

      if (userMatch && itemMatch) {
        const username = userMatch[1].trim();
        const itemName = itemMatch[1].trim();

        addPoints(username, itemName);

        const pointsAdded = itemValues[itemName.toLowerCase()] || 0;

        if (pointsAdded !== 0) {
          message.reply(
            `${pointsAdded} Foundry Points added to ${username} for ${itemName} drop.`,
          );
        } else {
          message.react("✅");
          console.log(`Unknown item used ${itemName}`);
        }

        return;
      }
    }
  }
});

client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
