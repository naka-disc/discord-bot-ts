import {
  Client,
  Intents,
  MessageEmbed,
  TextChannel,
  VoiceState,
} from "discord.js";
// TODO: ここのインポートが気持ち悪いので修正予定
import Config, { Envs } from "./Config";
import { VcAccessRecordDAO } from "./DAO/VcAccessRecordDAO";
import { VcAccessRecord } from "./Entity/VcAccessRecord";
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
    // Botの入退室は対象外
    if (newState.member?.user.bot) return;
    // チェック対象じゃないVCの入退室は対象外
    const isCheckChannel = newState.channelId === this.envs.CHECK_CH_ID;
    const isChannelDiff = oldState.channelId !== newState.channelId;
    if (!isCheckChannel && !isChannelDiff) return;
    // 書き込み対象チャンネルがテキストじゃなければ対象外
    const postChannel = this.client.channels.cache.get(this.envs.POST_CH_ID);
    if (!postChannel?.isText) return;

    // TODO: replace to an embed message
    let title: string = "";
    let msg: string = "";
    let actionTime: string;

    // 入退室を判定して書き込み
    const isJoin = oldState.channelId === null;
    const isLeave = newState.channelId === null;

    if (isJoin) {
      // 入室時
      // 入室情報だけ記載して、入退室情報を登録
      const entity = new VcAccessRecord();
      entity.memberId = newState.member?.user.id;
      entity.memberNme = newState.member?.user.username;
      entity.memberDiscriminator = newState.member?.user.discriminator;
      entity.inDatetime = new Date().toLocaleString("ja");
      const dao = new VcAccessRecordDAO();
      await dao.addVcAccessRecord(entity);

      // 投稿用メッセージ生成
      title = "入室通知";
      actionTime = entity.inDatetime;
      msg = `Member：${entity.memberNme}\nLogLocation：${newState.channel?.name}\nDatetime：${actionTime}`;

    } else if (isLeave) {
      // 退室時
      // 退室情報が未入力の入退室情報を取得し、退室日時と滞在時間を埋めて再登録
      const memberId = oldState.member?.user.id;
      if (memberId !== undefined) {
        const dao = new VcAccessRecordDAO();
        const entity = await dao.getVcAccessRecordByMemberId(memberId);
        if (entity !== undefined) {
          entity.outDatetime = new Date().toLocaleString("ja");
          actionTime = entity.outDatetime;
          const time = new Date(entity.outDatetime).getTime() - new Date(entity.inDatetime).getTime();
          entity.staySecond = Math.floor(time / (1000));
          await dao.addVcAccessRecord(entity);

          // 投稿用メッセージ生成
          title = "退出通知";
          const min = Math.floor(entity.staySecond / (60))
          const sec = Math.floor(entity.staySecond % (60))
          msg = `Member：${entity.memberNme}\nLogLocation：${oldState.channel?.name}\nDatetime：${actionTime}\nStaytime：${min}:${sec}`;
        }
      }


    }

    // メッセージ生成失敗の場合はエラー
    if (msg === "") throw new Error("Unexpected Error: _voiceStateUpdate()");

    // メッセージ送信
    const embed = this.createEmbed(title, msg);
    (postChannel as TextChannel).send({ embeds: [embed] });
  }

  /**
   * Embed生成
   * TODO: サンプル処理
   * @returns 
   */
  private createEmbed(title: string, msg: string): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor("#008080") // 左縁の線のカラーリングß
      .setTitle(title)
      .setDescription(msg)
      .setTimestamp();

    return embed;
  }
}
