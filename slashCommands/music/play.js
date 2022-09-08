const { getVoiceConnection } = require("@discordjs/voice");
const { default: YouTube } = require('youtube-sr');
const { Permissions } = require("discord.js");
module.exports = {
    name: "play",
    description: "Spielt music in deinem Voice Kanal!",
    options: [
        {
            name: "name",
            description: "name von dem song",
            type: "STRING",
            required: true,
        },
    ],
    run: async (client, interaction, args, prefix) => {
        if(!interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content:"🔴 **Bitte trete erst einem Voice Kanal bei!**"}).catch(() => null);
        if(!interaction.member.voice.channel?.permissionsFor(interaction.guild?.me)?.has(Permissions.FLAGS.CONNECT)) {
            return interaction.reply({ephemeral: true, content: "❗ **Mir fehlen die Rechte um in deinem Voice Kanal zu betreten!**"}).catch(() => null);
        }
        if(!interaction.member.voice.channel?.permissionsFor(interaction.guild?.me)?.has(Permissions.FLAGS.SPEAK)) {
            return interaction.reply({ephemeral: true, content: "❗ **Mir fehlen die Rechte um in deinem Voice Kanal zu sprechen!**"}).catch(() => null);
        }
         
     
        const oldConnection = getVoiceConnection(interaction.guild.id);
        if(oldConnection && oldConnection.joinConfig.channelId != interaction.member.voice.channelId) return interaction.reply({ ephemeral: true, content: "👎 **Wir sind nicht im selben Voice Kanal**!"}).catch(() => null);
    
        const track = args.join(" ");
        if(!args[0]) return interaction.reply({ ephemeral: true, content:`❌ Bitte füge ein Song hinzu: \`${prefix}play <Name/Link>\``}).catch(() => null);
        
        const youtubRegex = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistRegex = /^.*(list=)([^#\&\?]*).*/gi;
        const songRegex = /^.*(watch\?v=)([^#\&\?]*).*/gi;

        let song = null;
        let playlist = null;
       
        const isYT = youtubRegex.exec(track);
        const isSong = songRegex.exec(track);
        const isList = playlistRegex.exec(track)
                
        if(!oldConnection) {
      
            try {
                await client.joinVoiceChannel(interaction.member.voice.channel)
            } catch (e){ console.error(e);
                return interaction.reply({ ephemeral: true, content:`❌ Kann dem Voice nicht joinen weil: \`\`\`${e.interaction || e}`.substr(0, 1950) + `\`\`\``}).catch(() => null);
            }
        }
        try {
            
            await interaction.reply({ ephemeral: true, content:`🔍 *Sucht nach dem Song **${track}** ...*`}).catch(() => null);
          
            let queue = client.queues.get(interaction.guild.id); 
         
            if(!oldConnection && queue) {
                client.queues.delete(interaction.guild.id)
                queue = undefined;
            }
          
            if(isYT && isSong && !isList) {
                song = await YouTube.getVideo(track); 
            }
          
            else if(isYT && !isSong && isList) {
                playlist = await YouTube.getPlaylist(track).then(playlist => playlist.fetch());
            }
       
            else if(isYT && isSong && isList) {
                song = await YouTube.getVideo(`https://www.youtube.com/watch?v=${isSong[2]}`); 
                playlist = await YouTube.getPlaylist(`https://www.youtube.com/playlist?list=${isList[2]}`).then(playlist => playlist.fetch());
            }
         
            else {
                song = await YouTube.searchOne(track); 
            }
            if(!song && !playlist) return interaction.editReply({ ephemeral: true, content: `❗ **Kein Song gefunden! Name:  ${track}!**`});
      
            if(!playlist) {
            
                if(!queue || queue.tracks.length == 0) { 
                  
                    const bitrate = Math.floor(interaction.member.voice.channel.bitrate / 1000);
                 
                    const newQueue = client.createQueue(song, interaction.user, interaction.channelId, bitrate)
                    client.queues.set(interaction.guild.id, newQueue)
                  
                    await client.playSong(interaction.member.voice.channel, song);
                      
                    return interaction.editReply({ ephemeral: false, content: `🍹 **Nun Spielt: __${song.title}__** `}).catch(() => null);
                }
              
                queue.tracks.push(client.createSong(song, interaction.user))
                   
                return interaction.editReply({ ephemeral: false, content: `👍 **Hinzugegüt zur Warteschlange \`${client.queuePos(queue.tracks.length - 1)}\`: __${song.title}__**  ` }).catch(() => null);
            } 
          
            else {
              
                song = song ? song : playlist.videos[0];
               
                const index = playlist.videos.findIndex(s => s.id == song.id) || 0;
                playlist.videos.splice(index, 1) 
            
                if(!queue || queue.tracks.length == 0) { 
                 
                    const bitrate = Math.floor(interaction.member.voice.channel.bitrate / 1000);
              
                    const newQueue = client.createQueue(song, interaction.user, interaction.channelId, bitrate)
                    playlist.videos.forEach(song => newQueue.tracks.push(client.createSong(song, interaction.user)))
                    client.queues.set(interaction.guild.id, newQueue)
                  
                    await client.playSong(interaction.member.voice.channel, song);
                     
                    return interaction.editReply({ ephemeral: false, content: `🍹 **Nun Spielt: __${song.title}__** \n> **Added \`${playlist.videos.length - 1} Songs\` from the Playlist:**\n> __**${playlist.title}**__`}).catch(() => null);
                }
                // Add the playlist songs to the queue
                playlist.videos.forEach(song => queue.tracks.push(client.createSong(song, interaction.user)))
                // edit the loading interaction                    
                return interaction.editReply({ ephemeral: false, content: `🍹 ** Hinzugegüt zur Warteschlange\`${client.queuePos(queue.tracks.length - (playlist.videos.length - 1))}\`: __${song.title}__** \n> **Added \`${playlist.videos.length - 1} Songs\` from the Playlist:**\n> __**${playlist.title}**__`}).catch(() => null);
            }

        } catch (e){ console.error(e);
            return interaction.reply({ ephemeral: true, content:`❌ Ich kann den Song nicht spielen weil: \`\`\`${e.interaction || e}`.substr(0, 1950) + `\`\`\``}).catch(() => null);
        }
    },
};