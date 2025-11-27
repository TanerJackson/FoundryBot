import { SlashCommandBuilder } from "discord.js";
import { getPoints } from "../points.js";

export default {
  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Check Foundry and Community points for a user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to check points for")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("target") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({
        content: "User not found in this server.",
        ephemeral: true,
      });
    }

    const username = member.displayName;
    const total = getPoints(username);

    interaction.reply({
      content: `${username} has ${total[0]} Foundry points and ${total[1]} Community points.`,
      ephemeral: false,
    });
  },
};
