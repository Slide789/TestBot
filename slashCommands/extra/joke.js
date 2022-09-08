const discord = require("discord.js");
const jokes = require("discord-jokes");



module.exports = {
    name: "joke",
    description: "Lasse dir ein Witz anzeigen",
    run: async (client, interaction, args) => {
        jokes.getRandomDadJoke(function (joke) {
            const dadjokeEmbed = new discord.MessageEmbed()
              .setColor("FUCHSIA")
              .setTitle("Her ist ein neuer Witz für dich 🤣")
              .setDescription(`${joke}`)
              .setTimestamp();
        
            interaction
              .reply({
                embeds: [dadjokeEmbed]
              })
       
                });
              }
          };
        
        
    