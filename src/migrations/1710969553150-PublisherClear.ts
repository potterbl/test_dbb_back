import { MigrationInterface, QueryRunner } from "typeorm";

export class PublisherClear1710969553150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM publisher_entity")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
