module.exports = {
    name: "ping",
    aliases: ["latency"],
    description: "Lasse dir den Ping anziegen!",
    run: async (client, interaction, args) => {
        interaction.reply({
            content: `:ping_pong: **PONG! Der Ping ist: \`${client.ws.ping}ms\`**`,
            ephemeral: true
        }).catch(() => null);
    },
};