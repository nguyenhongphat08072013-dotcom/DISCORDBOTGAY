const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pong!', fetchReply: true });
    const diff = sent ? (Date.now() - interaction.createdTimestamp) : 0;
    await interaction.followUp({ content: `Roundtrip: ${diff}ms`, ephemeral: true });
  }
};
