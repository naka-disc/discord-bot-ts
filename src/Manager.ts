import { Client, Intents, Message, TextChannel, VoiceState } from "discord.js";

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
      ],
    });

    this.client.on("messageCreate", this._sendMessage);
    this.client.on("voiceStateUpdate", this._voiceStateUpdate);
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

    if (newState.member?.user.bot) return;
    if (!isCheckChannel && !isChannelDiff) return;

    if (isJoin) {
      // do something
    } else if (isLeave) {
      // do something
    }
  }

  /**
   * マネージャ実行
   * Botの起動用処理
   */
  run() {
    this.client.login(this.envs.BOT_TOKEN);
  }
}
