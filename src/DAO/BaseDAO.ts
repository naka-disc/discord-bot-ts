import { Connection, createConnection } from "typeorm"


/**
 * DataAccessObjectの基底クラス
 */
export class BaseDAO {

  protected connection!: Connection;

  /**
  * コネクションを生成
  * TODO: 本当はコンストラクタでやりたいが、asyncでないためここを毎回呼ぶ形で妥協してる
  */
  async getConnection(): Promise<Connection> {
    this.connection = await createConnection();
    return this.connection;
  }

}