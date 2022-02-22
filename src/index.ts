const { Client, Intents } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })

client.on('ready', () => {
  console.log(`${client.user.tag} でログインしています。`)
})

client.on('messageCreate', async msg => {
  if (msg.content === '!ping') {
    msg.channel.send('Pong!')
  }
})

const DISCORD_VC_CHECK_BOT_TOKEN = "xxxxx"
client.login(DISCORD_VC_CHECK_BOT_TOKEN)
