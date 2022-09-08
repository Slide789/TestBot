const { getVoiceConnection } = require("@discordjs/voice");
module.exports = {
    name: "skip",
    description: "Überspringt den Song un wechselt zum nächsten!",
    run: async (client, interaction, args, prefix) => {
        if(!interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "🔴 **Bitte trete erst einem Voice Kanal bei!**"}).catch(() => null);
        
        const oldConnection = getVoiceConnection(interaction.guild.id);
        if(!oldConnection) return interaction.reply({ ephemeral: true, content: "❌ **Ich bin nicht in einem Voice Kanal verbunden!**"}).catch(() => null);
        if(oldConnection && oldConnection.joinConfig.channelId != interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "❗ **Wir sind nicht im selben Voice Kanal**!"}).catch(() => null);
        
        const queue = client.queues.get(interaction.guild.id); 
        if(!queue) { 
            return interaction.reply({ ephemeral: true, content: `❗ **Derzeit spielt kein Song!**`}).catch(() => null);
        }
       
        if(!queue.tracks || queue.tracks.length <= 1) { 
            return interaction.reply({ ephemeral: true, content: `❗ **Es gibt kein nächsten Song!**`}).catch(() => null);
        }
        queue.skipped = true;
      
        oldConnection.state.subscription.player.stop();
        
        return interaction.reply({ ephemeral: false, content: `🍹 **Erfolgreich den Song übersprungen!**`}).catch(() => null);
    },
};