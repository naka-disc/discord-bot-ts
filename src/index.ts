import { Client, Intents, Message } from 'discord.js'

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
})

client.on('ready', () => {
  console.log(`${client.user?.tag} でログインしています。`)
})

client.on('messageCreate', async (msg: Message) => {
  if (msg.content === '!ping') {
    msg.channel.send('Pong!')
  }
})

const DISCORD_VC_CHECK_BOT_TOKEN = "xxx"
client.login(DISCORD_VC_CHECK_BOT_TOKEN)
