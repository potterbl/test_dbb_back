import { MigrationInterface, QueryRunner } from "typeorm";

export class ClearDatabase1711051256678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM book_entity_authors_author_entity");
        await queryRunner.query("DELETE FROM book_entity_genres_genre_entity");
        await queryRunner.query("DELETE FROM book_entity");
        await queryRunner.query("DELETE FROM author_entity");
        await queryRunner.query("DELETE FROM user_entity");
        await queryRunner.query("DELETE FROM genre_entity");
        await queryRunner.query("DELETE FROM publisher_entity");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
