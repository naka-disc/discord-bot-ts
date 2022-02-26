import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


/**
 * VCの入退室ログエンティティ
 * 入室時と退室時に使用するため、退室日時と滞在時間はNull許容
 */
@Entity()
export class VcAccessRecord {

  @PrimaryGeneratedColumn()
  id!: number;

  /** Discord Member ID */
  @Column("text", { nullable: false })
  memberId!: string | undefined;

  /** Discord Member Name */
  @Column("text", { nullable: false })
  memberNme!: string | undefined;

  /** Discord Member Discriminator #0000 みたいなやつ */
  @Column("text", { nullable: false })
  memberDiscriminator!: string | undefined;

  /** 入室日時 */
  @Column("text", { nullable: false })
  inDatetime!: string;

  /** 退室日時 */
  @Column("text", { nullable: true })
  outDatetime!: string;

  /** 滞在時間 */
  @Column("text", { nullable: true })
  staySecond!: number;

}
