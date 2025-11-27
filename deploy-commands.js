import { REST, Routes } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = (await import(`./commands/${file}`)).default;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Refreshing slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log("Slash commands updated!");
  } catch (error) {
    console.error(error);
  }
})();
