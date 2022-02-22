import { Client, Intents, Message, MessageEmbed } from 'discord.js';

/**
 * Discord Clientを管理するクラス
 * このクラスを生成して、runすればBotが起動
 */
export default class Manager {

  private token: string;

  private client: Client;

  /**
   * コンストラクタ
   * @param token Botトークン
   */
  constructor(token: string) {
    // Botトークン ここで管理
    this.token = token;

    // Botクライアント生成 ここで管理
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
    });

    this.client.on("messageCreate", this.sendMessage.bind(this));
  }

  /**
   * メッセージ送信
   * @param msg 受信メッセージ
   * @returns 
   */
  async sendMessage(msg: Message): Promise<void> {
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
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/AfFp7pu.png')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addField('Inline field title', 'Some value here', true)
      .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    return exampleEmbed;
  }

  /**
   * マネージャ実行
   * Botの起動用処理
   */
  run() {
    this.client.login(this.token);
  }

}
