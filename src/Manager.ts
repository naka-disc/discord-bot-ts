import {
  Client,
  Intents,
  Message,
  MessageEmbed,
  TextChannel,
  VoiceState,
} from "discord.js";
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

    // 入力値に応じて分岐
    if (msg.content === "!embed") {
      const ret = this.createEmbed();
      msg.channel.send({ embeds: [ret] });
    } else {
      // msg.channel.send('Other');
    }
  }

  /**
   * Embed生成
   * @returns MessageEmbed
   */
  createEmbed(): MessageEmbed {
    // TODO: Sample実装
    const exampleEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Some title")
      .setURL("https://discord.js.org/")
      .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
      })
      .setDescription("Some description here")
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      )
      .addField("Inline field title", "Some value here", true)
      .setImage("https://i.imgur.com/AfFp7pu.png")
      .setTimestamp()
      .setFooter({
        text: "Some footer text here",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });
    return exampleEmbed;
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
