const discord = require("discord.js");



module.exports = {
    name: "help",
    aliases: ["latency"],
    description: "Du brauchst hilfe?",
    run: async (client, interaction, args) => {
        const botinfoEmbed = new discord.MessageEmbed()
        .setColor("FUCHSIA")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle("Hier findest du die Commands!")
        .addField("Music 🔊", "*Join, Play, Volume, skip, queue, delqueue, leave*")
        .addField("Fun 🤣", `*Joke, Meme*`)
        .setTimestamp();
    
      interaction.reply({
        embeds: [botinfoEmbed],
      });
    }
        }
    
