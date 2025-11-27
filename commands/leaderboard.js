import { SlashCommandBuilder } from "discord.js";
import { getAllPoints } from "../points.js";

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the Foundry point leaderboard"),

  async execute(interaction) {
    const allPoints = getAllPoints();
    const entries = Object.entries(allPoints);

    if (entries.length === 0) {
      return interaction.reply("No points!");
    }

    entries.sort((a, b) => b[1] - a[1]);

    let text = "**Foundry Point Leaderboard**\n\n";
    for (const [user, points] of entries) {
      text += `**${user}** — ${points} points\n`;
    }

    interaction.reply(text);
  },
};
