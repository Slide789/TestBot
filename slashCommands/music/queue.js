const { getVoiceConnection } = require("@discordjs/voice");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "queue",
    description: "Lasse dir die Songs anzeigen!",
    run: async (client, interaction, args, prefix) => {
        if(!interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "🔴 **Bitte trete erst ein VC bei!**"}).catch(() => null);
        // get an old connection
        const oldConnection = getVoiceConnection(interaction.guild.id);
        if(!oldConnection) return interaction.reply({ ephemeral: true, content: "❌ **Ich bin mit keinem VC verbunden!**"}).catch(() => null);
        if(oldConnection && oldConnection.joinConfig.channelId != interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "❗ **Wir sind nicht im selben VC**!"}).catch(() => null);
        
        const queue = client.queues.get(interaction.guild.id); // get the queue
        if(!queue || !queue.tracks || !queue.tracks[0]) { 
            return interaction.reply({ ephemeral: true, content: `❌ **Derzeit spielt kein Song**`}).catch(() => null);
        }
        const e2n = s => s ? "✅ Enabled" : "❌ Disabled" 
        const song = queue.tracks[0];
        const queueEmbed = new MessageEmbed().setColor("FUCHSIA")
            .setTitle(`Die ersten 15 Songs in der Warteschlange`)
            .setDescription(`**Aktuel spielt der Song:** \`0.\` - [${song.title}](${client.getYTLink(song.id)})`)
            .addFields(
                queue.tracks.slice(1).slice(0, 15).map((track, index) => {
                    return {
                        name: `\`${client.queuePos(index + 1)})\` Song \`${track.durationFormatted}\``,
                        value: `> [${track.title}](${client.getYTLink(track.id)}) - ${track.requester}`,
                        inline: true
                    }
                })
            )
        return interaction.reply({ ephemeral: false, content:`ℹ️ **Hier sind zu viele Song in der Warteschlange ${queue.tracks.length - 1} oder ein ERR ist pasiert!**`, embeds: [queueEmbed]}).catch(() => null);
    },
};