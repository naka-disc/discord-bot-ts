import Manager from "./Manager";

// Botトークン
// TODO: envとかから取得
const DISCORD_VC_CHECK_BOT_TOKEN = "xxxx";

// マネージャクラスを生成し、実行することでBotが作動
const manager = new Manager(DISCORD_VC_CHECK_BOT_TOKEN);
manager.run();
