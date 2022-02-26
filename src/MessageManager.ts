import { Message, MessageEmbed } from "discord.js";

/**
 * メッセージ受信時用のマネージャクラス
 */
export default class MessageManager {

  /**
   * マネージャ実行
   * メッセージ受信時にキックする処理
   * @param msg Discordのメッセージオブジェクト
   * @returns 
   */
  async run(msg: Message): Promise<void> {
    // メッセージの内容でディスパッチしてEmbedを生成
    let embed;
    switch (msg.content) {
      case "!test":
        embed = this.createEmbed();
        break;

      default:
        // 定義されていないなら何もしない
        return;
    }

    // メッセージ送信
    msg.channel.send({ embeds: [embed] });
  }


  /**
   * Embed生成
   * TODO: サンプル処理
   * @returns 
   */
  private createEmbed(): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor("#008080") // 左縁の線のカラーリングß
      .setTitle("Some title")
      .setDescription("Some description here")
      .setTimestamp();

    return embed;
  }

}