import { MigrationInterface, QueryRunner } from "typeorm";

export class GenreClear1710969653985 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM genre_entity")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
