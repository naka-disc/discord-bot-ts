import {
  Client,
  Intents,
  TextChannel,
  VoiceState,
} from "discord.js";
// TODO: ここのインポートが気持ち悪いので修正予定
import Config, { Envs } from "./Config";
import MessageManager from "./MessageManager";

/**
 * Discord Clientを管理するクラス
 * このクラスを生成して、runすればBotが起動
 */
export default class Manager {

  /** 環境変数 */
  private envs: Envs;

  /** DIscord Bot Client */
  private client: Client;

  /** メッセージ受信時用のマネージャ */
  private messageManager: MessageManager;

  /**
   * コンストラクタ
   * @param token Botトークン
   */
  constructor() {
    this.envs = Config.getInstance().getEnvs();
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });

    // 各イベントに対応するマネージャを生成
    this.messageManager = new MessageManager();
  }

  /**
   * マネージャ実行
   * Botの起動用処理
   */
  run() {
    //  トークンを使ってログインすることで起動
    this.client.login(this.envs.BOT_TOKEN);
    // 起動時処理
    this.client.on("ready", () => {
      console.log(`${this.client.user?.tag} でログインしています。`);
    });

    // 各イベントに対応する処理をバインド
    this.client.on("voiceStateUpdate", this._voiceStateUpdate.bind(this));
    this.client.on("messageCreate", this.messageManager.run.bind(this.messageManager));
  }

  /**
   * voiceStateUpdate Event
   */
  private async _voiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState
  ): Promise<void> {
    const isCheckChannel = newState.channelId === this.envs.CHECK_CH_ID;
    const isChannelDiff = oldState.channelId !== newState.channelId;
    const isJoin = oldState.channelId === null;
    const isLeave = newState.channelId === null;
    const postChannel = this.client.channels.cache.get(this.envs.POST_CH_ID);
    let msg: string = "";

    // TODO: replace to an embed message
    function sendText(msg: string) {
      // https://stackoverflow.com/questions/52258064/discord-js-sending-a-message-to-a-specific-channel
      (postChannel as TextChannel).send(msg);
    }

    if (newState.member?.user.bot) return;
    if (!isCheckChannel && !isChannelDiff) return;
    if (!postChannel?.isText) return;

    if (isJoin) {
      msg = `${newState.member?.displayName}さんが${newState.channel?.name}に参加しました。`;
    } else if (isLeave) {
      msg = `${oldState.member?.displayName}さんが${oldState.channel?.name}を退出しました。`;
    }
    if (msg === "") throw new Error("Unexpected Error: _voiceStateUpdate()");

    sendText(msg);
  }
}
