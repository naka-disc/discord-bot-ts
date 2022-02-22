import { Client, Intents, Message, TextChannel, VoiceState } from "discord.js";
import { Envs } from "./index";

/**
 * Discord Clientを管理するクラス
 * このクラスを生成して、runすればBotが起動
 */
export default class Manager {
  private envs: Envs;

  private client: Client;

  /**
   * コンストラクタ
   * @param token Botトークン
   */
  constructor(envs: Envs) {
    // Botトークン ここで管理
    this.envs = envs;

    // Botクライアント生成 ここで管理
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });
  }

  /**
   * メッセージ送信
   * @param msg 受信メッセージ
   * @returns
   */
  private async _sendMessage(msg: Message): Promise<void> {
    // 送信者がBotの場合は反応しない
    if (msg.author.bot) {
      return;
    }

    msg.channel.send("Pong!");
  }

  private async _voiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState
  ): Promise<void> {
    const isCheckChannel = newState.channelId === this.envs.CHECK_CH_ID;
    const isChannelDiff = oldState.channelId !== newState.channelId;
    const isJoin = oldState.channelId === null;
    const isLeave = newState.channelId === null;
    const postChannel = this.client.channels.cache.get(this.envs.POST_CH_ID);

    // tmp
    function sendText() {
      // https://stackoverflow.com/questions/52258064/discord-js-sending-a-message-to-a-specific-channel
      if (postChannel?.isText) {
        if (isJoin) {
          (postChannel as TextChannel).send(
            `${newState.member?.displayName}さんが${newState.channel?.name}に参加しました。`
          );
        } else {
          (postChannel as TextChannel).send(
            `${oldState.member?.displayName}さんが${oldState.channel?.name}を退出しました。`
          );
        }
      }
    }

    if (newState.member?.user.bot) return;
    if (!isCheckChannel && !isChannelDiff) return;

    if (isJoin) {
      // do something
      sendText();
    } else if (isLeave) {
      // do something
      sendText();
    }
  }

  /**
   * マネージャ実行
   * Botの起動用処理
   */
  run() {
    this.client.login(this.envs.BOT_TOKEN);
    this.client.on("ready", () => {
      console.log(`${this.client.user?.tag} でログインしています。`);
    });
    this.client.on("voiceStateUpdate", this._voiceStateUpdate.bind(this));
    this.client.on("messageCreate", this._sendMessage.bind(this));
  }
}
