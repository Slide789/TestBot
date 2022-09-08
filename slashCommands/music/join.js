const { getVoiceConnection } = require("@discordjs/voice");
const { Permissions } = require("discord.js");
module.exports = {
    name: "join",
    description: "Tritt deinem Sprach Kanal bei!",
    run: async (client, interaction, args, prefix) => {
        try {
            if(!interaction.member.voice.channelId) return interaction.reply(({ ephemeral: true, content: "🔴 **Bitte trete erst einem Voice Kanal bei!**"})).catch(() => null);
            
            const oldConnection = getVoiceConnection(interaction.guild.id);
            if(oldConnection) return interaction.reply({ ephemeral: true, content:`❗ **Ich bin schon verbunden in <#${oldConnection.joinConfig.channelId}>**!`}).catch(() => null);
            
            if(!interaction.member.voice.channel?.permissionsFor(interaction.guild?.me)?.has(Permissions.FLAGS.CONNECT)) {
                return interaction.reply({ephemeral: true, content: "❌ **Mir fehlen die Rechte deinem Voice Kanal zu betreten!**"}).catch(() => null);
            }
            if(!interaction.member.voice.channel?.permissionsFor(interaction.guild?.me)?.has(Permissions.FLAGS.SPEAK)) {
                return interaction.reply({ephemeral: true, content: "❌ **Mir fehlen die Rechte um in deinen Kanal zu sprechen!!**"}).catch(() => null);
            }
            
            await client.joinVoiceChannel(interaction.member.voice.channel);
            interaction.reply({ ephemeral: false, content:"🍹 **Ich bin deinem Voice Kanal beigetreten**"}).catch(() => null);
        } catch(e) { 
            console.error(e);
            interaction.reply({ ephemeral: true, content:`❌ Ich kann dem Voice Kanal nicht beitreten weil: \`\`\`${e.interaction || e}`.substring(0, 1950) + `\`\`\``}).catch(() => null);
        }
    },
}