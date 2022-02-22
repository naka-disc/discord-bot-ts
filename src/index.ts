import { Client, Intents, Message } from "discord.js";
import invariant from "tiny-invariant";
import dotenv from "dotenv";

dotenv.config();

const CHECK_CH_ID = process.env.DISCORD_VC_CHECK_TARGET_CH_ID;
const POST_CH_ID = process.env.DISCORD_VC_CHECK_POST_CH_ID;
const BOT_TOKEN = process.env.DISCORD_VC_CHECK_BOT_TOKEN;

invariant(CHECK_CH_ID, "DISCORD_VC_CHECK_TARGET_CH_ID is not defined");
invariant(POST_CH_ID, "DISCORD_VC_CHECK_POST_CH_ID is not defined");
invariant(BOT_TOKEN, "DISCORD_VC_CHECK_BOT_TOKEN is not defined");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on("ready", () => {
  console.log(`${client.user?.tag} でログインしています。`);
});

client.on("messageCreate", async (msg: Message) => {
  if (msg.content === "!ping") {
    msg.channel.send("Pong!");
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.member?.user.bot) return;

  const isCheckChannel = newState.channelId === CHECK_CH_ID;
  const isChannelDiff = oldState.channelId !== newState.channelId;

  if (!isCheckChannel && !isChannelDiff) return;
});

const DISCORD_VC_CHECK_BOT_TOKEN = "xxx";
client.login(DISCORD_VC_CHECK_BOT_TOKEN);
