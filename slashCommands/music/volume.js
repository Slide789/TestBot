const { getVoiceConnection } = require("@discordjs/voice");
module.exports = {
    name: "volume",
    description: "Ändere die Lautstärke des Bots!",
    options: [
        {
            name: "volume",
            description: "Wähle eine Lautstärke zwichen 1-100",
            type: "INTEGER",
            required: true,
        },
    ],
    run: async (client, interaction, args, prefix) => {
        if(!interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "🔴 **Bitte trete erst einem Voice Kanal bei!**"}).catch(() => null);
  
        const oldConnection = getVoiceConnection(interaction.guild.id);
        if(!oldConnection) return interaction.reply({ ephemeral: true, content: "❌ **Ich bin nicht mit einem Voice Kanal verbunden**"})
        if(oldConnection && oldConnection.joinConfig.channelId != interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "👎 **Wir sind nicht in dem selben Voice Kanal**!"}).catch(() => null);
        
        const queue = client.queues.get(interaction.guild.id); 
        if(!queue) { 
            return interaction.reply({ ephemeral: true, content: `❗ **Zurzeit spielt kein Song!**`});
        }
        if(!args[0] || isNaN(args[0]) || Number(args[0]) < 1 || Number(args[0]) > 150) return interaction.reply({ ephemeral: true, content: `❗ **Bitte gebe eine Lautsätke zwischen 1 und 100 an** Usage: \`${prefix}volume 25\``}).catch(() => null);
        const volume = Number(args[0]);
        queue.volume = volume;

        // change the volume
        oldConnection.state.subscription.player.state.resource.volume.setVolume(volume / 100);
        
        return interaction.reply({ ephemeral: false, content: `📢 **Erfolreich das Volume zu  \`${volume}% geändert\`**`}).catch(() => null);
    },
};