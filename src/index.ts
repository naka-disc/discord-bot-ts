import dotenv from "dotenv";
import invariant from "tiny-invariant";
import Manager from "./Manager";

dotenv.config();

export interface Envs {
  CHECK_CH_ID: string;
  POST_CH_ID: string;
  BOT_TOKEN: string;
}

// Check enviroment variables
const CHECK_CH_ID = process.env.DISCORD_VC_CHECK_TARGET_CH_ID;
const POST_CH_ID = process.env.DISCORD_VC_CHECK_POST_CH_ID;
const BOT_TOKEN = process.env.DISCORD_VC_CHECK_BOT_TOKEN;

invariant(CHECK_CH_ID, "DISCORD_VC_CHECK_TARGET_CH_ID is not defined");
invariant(POST_CH_ID, "DISCORD_VC_CHECK_POST_CH_ID is not defined");
invariant(BOT_TOKEN, "DISCORD_VC_CHECK_BOT_TOKEN is not defined");

const envs: Envs = { CHECK_CH_ID, POST_CH_ID, BOT_TOKEN };

// マネージャクラスを生成し、実行することでBotが作動
const manager = new Manager(envs);
manager.run();
