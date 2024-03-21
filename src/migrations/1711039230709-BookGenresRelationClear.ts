import { MigrationInterface, QueryRunner } from "typeorm";

export class BookGenresRelationClear1711039230709 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM book_entity_genres_genre_entity")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
