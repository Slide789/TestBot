module.exports = (client) => {
    console.log(` Logged in as ${client.user.tag}!`);
    client.user.setActivity(`/join | 💤 Mind Music 💤`, {type: "PLAYING"})
    setInterval(() => {
        client.user.setActivity(`/help | 💤 Mind Music 💤`, {type: "PLAYING"})
    }, 600_00)
}