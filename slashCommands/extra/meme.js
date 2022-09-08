const discord = require("discord.js");
const axios = require("axios");


module.exports = {
    name: "meme",
    description: "Lasse dir ein Meme anzeigen!",
    run: async (client, interaction, args) => {
        const url = "https://meme-api.herokuapp.com/gimme";

        axios
          .get(url)
          .then((res) => {
            const memeEmbed = new discord.MessageEmbed()
              .setColor("FUCHSIA")
              .setTitle(res.data.title)
              .setImage(res.data.url)
              .setTimestamp();
      
            const row = new discord.MessageActionRow().addComponents(
              new discord.MessageButton()
                .setLabel("Link")
                .setStyle("LINK")
                .setURL(res.data.postLink)
            );
      
        interaction
              .reply({
                embeds: [memeEmbed],
                components: [row],

              }) 
          })
          .catch((err) => {
            console.log(err);
            interaction.reply({
              content: "Ein Fehler ist passiert!.",
            });
          });
    
    },
};