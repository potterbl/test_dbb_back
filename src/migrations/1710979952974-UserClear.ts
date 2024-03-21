import { MigrationInterface, QueryRunner } from "typeorm";

export class UserClear1710979952974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM user_entity")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
