import { MigrationInterface, QueryRunner } from "typeorm";

export class BookAuthorRelationClear1711039219772 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM book_entity_authors_author_entity")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
