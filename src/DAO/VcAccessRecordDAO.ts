import { getRepository } from "typeorm";
import { VcAccessRecord } from "../Entity/VcAccessRecord";
import { BaseDAO } from "./BaseDAO";

/**
 * VCの入退室情報DAO
 */
export class VcAccessRecordDAO extends BaseDAO {

  /**
   * VCの入退室情報を登録する
   * TODO: IDがあれば更新にしてくれてるので、名前を変える
   * @param entity 
   * @returns 
   */
  async addVcAccessRecord(entity: VcAccessRecord): Promise<VcAccessRecord> {
    const con = await this.getConnection();
    const result = await con.manager.save(entity);
    await con.close();
    return result;
  }

  /**
   * VCの入退室情報を取得する
   * @param memberId DiscordのメンバーID
   * @returns 
   */
  async getVcAccessRecordByMemberId(memberId: string): Promise<VcAccessRecord | undefined> {
    const con = await this.getConnection();
    const repository = getRepository(VcAccessRecord, con.name);
    const result = await repository.findOne({ where: { memberId: memberId , outDatetime: null } });
    await con.close();
    return result;
  }
}
