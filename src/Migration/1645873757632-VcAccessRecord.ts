import {MigrationInterface, QueryRunner} from "typeorm";

export class VcAccessRecord1645873757632 implements MigrationInterface {
    name = 'VcAccessRecord1645873757632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vc_access_record" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "memberId" text NOT NULL, "memberNme" text NOT NULL, "memberDiscriminator" text NOT NULL, "inDatetime" text NOT NULL, "outDatetime" text, "staySecond" text)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vc_access_record"`);
    }

}
