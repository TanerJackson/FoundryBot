import { SlashCommandBuilder } from "discord.js";
import { addPoints } from "../points.js";
import { itemValues } from "../itemValues.js";
import { logAction } from "../logger.js";
export default {
  data: new SlashCommandBuilder()
    .setName("addpoint")
    .setDescription("Add Foundry points to a user based on an item")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to award points to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Item name to award points for")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.client.isAdmin(interaction.user.id)) {
      return interaction.reply({
        content: "Not authorized to add points.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("target");
    const member = interaction.guild.members.cache.get(user.id);
    const item = interaction.options.getString("item");
    if (!member) {
      return interaction.reply({
        content: "User not found in this server.",
        ephemeral: true,
      });
    }

    const username = member.displayName;
    const itemName = interaction.options.getString("item");

    addPoints(username, itemName);

    const pointsAdded = itemValues[itemName.toLowerCase()] || 0;

    if (pointsAdded !== 0) {
      interaction.reply({
        content: `Awarded ${pointsAdded} points (${itemName}) to ${username}.`,
      });
    } else {
      interaction.reply({
        content: `Item "${itemName}" has no points assigned.`,
      });
    }
    logAction(
      `Used /addpoint (item=${item}) on ${user.displayName}`,
      interaction.user.tag
    );
  },
};
