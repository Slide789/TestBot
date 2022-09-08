const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require("@discordjs/voice");

const client = new Client(clientSettingsObject());

client.deploySlash = {
  enabled: true,
  guild: false, 
}

client.config = require("./config/config.json");


client.commands = new Collection();
client.slashCommands = new Collection();
client.queues = new Collection();

require("./util/musicUtils.js")(client);


require("./util/handler.js")(client);

client.login(client.config.token);

setInterval(async () => {
  console.clear();
  }, 10000000);

  
function clientSettingsObject() {
  return {
    shards: "auto",
    allowedMentions: {
      parse: ["roles", "users",],
      repliedUser: false, 
    },
    failIfNotExists: false,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [ 
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
}






}