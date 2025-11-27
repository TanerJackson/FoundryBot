import { SlashCommandBuilder } from "discord.js";
import { addComPointsToMentions } from "../points.js";

export default {
  data: new SlashCommandBuilder()
    .setName("addcpoint")
    .setDescription("Add community points to mentioned users")
    .addUserOption((opt) =>
      opt
        .setName("target")
        .setDescription("User to give points")
        .setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("amount")
        .setDescription("Amount of points to add")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const user = interaction.options.getUser("target");

    if (!interaction.client.isAdmin(interaction.user.id)) {
      return interaction.reply({ content: "Not authorized.", ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: "User not found.", ephemeral: true });
    }

    const fakeMessage = {
      mentions: {
        members: new Map([[member.id, member]]),
      },
      reply: (msg) => interaction.reply(msg),
    };

    addComPointsToMentions(fakeMessage, amount);
  },
};
