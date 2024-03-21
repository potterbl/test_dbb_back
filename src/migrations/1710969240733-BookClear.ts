import { MigrationInterface, QueryRunner } from "typeorm";

export class BookClear1710969240733 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM book_entity")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
