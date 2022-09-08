const { getVoiceConnection } = require("@discordjs/voice");
module.exports = {
    name: "leave",
    description: "Verlässt dein Voice Kanal!",
    run: async (client, interaction, args, prefix) => {
        try {
            if(!interaction.member.voice.channelId) return interaction.reply(({ ephemeral: true, content: "🔴 **Bitte trete erst einem Voice Channel bei!**"})).catch(() => null);
            
            const oldConnection = getVoiceConnection(interaction.guild.id);
            if(!oldConnection) return interaction.reply({ ephemeral: true, content:"❌ **Ich bin in keinem Voice Kanal verbunden!**"}).catch(() => null);
            if(oldConnection && oldConnection.joinConfig.channelId != interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content:" ❗ **Wir sind nicht in dem selben voice Kanal**!"}).catch(() => null);
        
            await client.leaveVoiceChannel(interaction.member.voice.channel);
            
            interaction.reply({ ephemeral: false, content:"🍹 Ich habe den Voice Kanal verlassen!!"}).catch(() => null);
        } catch(e) { 
            console.error(e);
            interaction.reply({ ephemeral: true, content:`❌ Ich kann den Voice Kanal nicht verlassen weil: \`\`\`${e.interaction || e}`.substring(0, 1950) + `\`\`\``}).catch(() => null);
        }
    },
};