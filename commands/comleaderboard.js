import { SlashCommandBuilder } from "discord.js";
import { getAllComPoints } from "../points.js";

export default {
  data: new SlashCommandBuilder()
    .setName("comleaderboard")
    .setDescription("Show the Community point leaderboard"),

  async execute(interaction) {
    const allPoints = getAllComPoints();
    const entries = Object.entries(allPoints);

    if (entries.length === 0) {
      return interaction.reply("No points!");
    }

    entries.sort((a, b) => b[1] - a[1]);

    let text = "**Community Point Leaderboard**\n\n";
    for (const [user, points] of entries) {
      text += `**${user}** — ${points} points\n`;
    }

    interaction.reply(text);
  },
};
