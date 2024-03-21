import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthorClear1710968696974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM author_entity")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
