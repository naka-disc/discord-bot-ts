import dotenv from "dotenv";
import invariant from "tiny-invariant";

/**
 * 環境変数用のインターフェース
 */
export interface Envs {
  CHECK_CH_ID: string;
  POST_CH_ID: string;
  BOT_TOKEN: string;
}


/**
 * コンフィグ管理クラス
 * シングルトン運用
 */
export default class Config {

  /**
   * 自インスタンス
   */
  private static _instance: Config;

  /**
   * 環境変数
   */
  private static _envs: Envs;

  /**
   * コンストラクタ
   */
  constructor() {
    dotenv.config();

    const CHECK_CH_ID = process.env.DISCORD_VC_CHECK_TARGET_CH_ID;
    const POST_CH_ID = process.env.DISCORD_VC_CHECK_POST_CH_ID;
    const BOT_TOKEN = process.env.DISCORD_VC_CHECK_BOT_TOKEN;

    invariant(CHECK_CH_ID, "DISCORD_VC_CHECK_TARGET_CH_ID is not defined");
    invariant(POST_CH_ID, "DISCORD_VC_CHECK_POST_CH_ID is not defined");
    invariant(BOT_TOKEN, "DISCORD_VC_CHECK_BOT_TOKEN is not defined");

    Config._envs = { CHECK_CH_ID, POST_CH_ID, BOT_TOKEN };
  }

  /**
   * シングルトンインスタンスの取得
   */
  public static getInstance(): Config {
    // インスタンスがない場合のみ生成し、保持
    if (!this._instance) {
      this._instance = new Config();
    }

    // 保持しているインスタンスを返す
    return this._instance;
  }

  /**
   * 環境変数取得
   * @returns 
   */
  public getEnvs(): Envs {
    return Config._envs;
  }
}
