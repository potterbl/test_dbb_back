import {AppModule} from "./app.module";
import {Test, TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {Connection, QueryRunner} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {AuthorEntity} from "./entities/author.entity";
import {AuthorClear1710968696974} from "./migrations/1710968696974-AuthorClear";
import {BookEntity} from "./entities/book.entity";
import {BookClear1710969240733} from "./migrations/1710969240733-BookClear";
import {PublisherEntity} from "./entities/publisher.entity";
import {PublisherClear1710969553150} from "./migrations/1710969553150-PublisherClear";
import {GenreEntity} from "./entities/genre.entity";
import {GenreClear1710969653985} from "./migrations/1710969653985-GenreClear";
import {UserClear1710979952974} from "./migrations/1710979952974-UserClear";
import {BookAuthorRelationClear1711039219772} from "./migrations/1711039219772-BookAuthorRelationClear";
import {BookGenresRelationClear1711039230709} from "./migrations/1711039230709-BookGenresRelationClear";

describe("Authors controller", () => {
    let app;
    let connection: Connection;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        connection = moduleFixture.get<Connection>(Connection);
    });

    afterAll(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new AuthorClear1710968696974(), queryRunner);
        } finally {
            await queryRunner.release();
        }
        await connection.close();
        await app.close();
    });

    beforeEach(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new BookAuthorRelationClear1711039219772(), queryRunner);
            await applyMigration(new BookGenresRelationClear1711039230709(), queryRunner);
            await applyMigration(new AuthorClear1710968696974(), queryRunner);
            await applyMigration(new BookClear1710969240733(), queryRunner);
            await applyMigration(new PublisherClear1710969553150(), queryRunner);
            await applyMigration(new GenreClear1710969653985(), queryRunner);
            await applyMigration(new UserClear1710979952974(), queryRunner);
        } finally {
            await queryRunner.release();
        }
    })

    it('/authors/:id/books (GET) [404]', async () => {
        const authorId = 1
        return request(app.getHttpServer())
            .get(`/authors/${authorId}/books`)
            .expect(404)
    });

    it('/authors/:id/books (GET) [EMPTY]', async () => {
        const authorRepo = connection.getRepository(AuthorEntity)

        const newAuthor = new AuthorEntity()

        newAuthor.name = "test author"
        newAuthor.birthday = new Date()

        const author = await authorRepo.save(newAuthor)

        return request(app.getHttpServer())
            .get(`/authors/${author.id}/books`)
            .expect(200)
            .expect([])
    });

    it('/authors/:id/books (GET) [SOME BOOK]', async () => {
        const author = await createAndSaveTestAuthor();
        const publisher = await createAndSaveTestPublisher();
        const genre = await createAndSaveTestGenre();

        const book = await createAndSaveTestBook(author, publisher, genre);

        const response = await request(app.getHttpServer())
            .get(`/authors/${author.id}/books`)
            .expect(200);

        expect(Array.isArray(response.body)).toBeTruthy();

        expect(response.body.length).toBeGreaterThan(0);

        const bookResult = response.body[0];
        expect(bookResult).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: 'some title',
            isbn: '1234567891011',
            publishDate: expect.any(String),
            authors: expect.arrayContaining([
                expect.objectContaining({
                    id: author.id,
                    name: author.name,
                    birthday: author.birthday.toISOString(),
                })
            ]),
            publisher: expect.objectContaining({
                id: publisher.id,
                title: publisher.title,
                establishedYear: publisher.establishedYear,
            }),
            genres: expect.arrayContaining([
                expect.objectContaining({
                    title: genre.title,
                })
            ])
        }));
    });

    async function createAndSaveTestAuthor(): Promise<AuthorEntity> {
        const author = new AuthorEntity();
        author.name = 'Test Author';
        author.birthday = new Date();
        return await connection.getRepository(AuthorEntity).save(author);
    }
    async function createAndSaveTestPublisher(): Promise<PublisherEntity> {
        const publisher = new PublisherEntity();
        publisher.title = 'Test Publisher';
        publisher.establishedYear = new Date().getFullYear();
        return await connection.getRepository(PublisherEntity).save(publisher);
    }
    async function createAndSaveTestGenre(): Promise<GenreEntity> {
        const genre = new GenreEntity();
        genre.title = 'Test Genre';
        return await connection.getRepository(GenreEntity).save(genre);
    }
    async function createAndSaveTestBook(author: AuthorEntity, publisher: PublisherEntity, genre: GenreEntity): Promise<BookEntity> {
        const book = new BookEntity();
        book.title = 'some title';
        book.isbn = '1234567891011';
        book.authors = [author];
        book.publisher = publisher;
        book.genres = [genre];
        book.publishDate = new Date();
        book.history = [];
        return await connection.getRepository(BookEntity).save(book);
    }
})

describe("Books controller", () => {
    let app;
    let connection: Connection;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        connection = moduleFixture.get<Connection>(Connection);
    });

    afterAll(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new AuthorClear1710968696974(), queryRunner);
        } finally {
            await queryRunner.release();
        }
        await connection.close();
        await app.close();
    });

    beforeEach(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new BookAuthorRelationClear1711039219772(), queryRunner);
            await applyMigration(new BookGenresRelationClear1711039230709(), queryRunner);
            await applyMigration(new AuthorClear1710968696974(), queryRunner);
            await applyMigration(new PublisherClear1710969553150(), queryRunner);
            await applyMigration(new GenreClear1710969653985(), queryRunner);
            await applyMigration(new UserClear1710979952974(), queryRunner);
            await applyMigration(new BookClear1710969240733(), queryRunner);
        } finally {
            await queryRunner.release();
        }
    })

    it('/books (POST) [AS ADMIN]', async () => {
        const admin = await createAndSaveTestUserAdmin();
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();

        const tokenResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: admin.login,
                password: admin.password
            })

        const token = tokenResponse.body.token


        const response = await request(app.getHttpServer())
            .post('/books')
            .set('Authorization', token)
            .send({
                title: "Test title",
                isbn: "1234567891011",
                authors: [author.id],
                genres: [genre.id],
                publisher: publisher.id,
                publishDate: new Date()
            })
            .expect(201);

        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: 'Test title',
            isbn: '1234567891011',
            publishDate: expect.any(String),
            authors: expect.arrayContaining([
                expect.objectContaining({
                    id: author.id,
                    name: author.name,
                    birthday: author.birthday.toISOString(),
                })
            ]),
            publisher: expect.objectContaining({
                id: publisher.id,
                title: publisher.title,
                establishedYear: publisher.establishedYear,
            }),
            genres: expect.arrayContaining([
                expect.objectContaining({
                    title: genre.title,
                })
            ]),
            history: expect.any(Array)
        }));
    });

    it('/books (POST) [AS USER]', async () => {
        const user = await createAndSaveTestUser();
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();

        const tokenResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: user.login,
                password: user.password
            })

        const token = tokenResponse.body.token

        const response = await request(app.getHttpServer())
            .post('/books')
            .set('Authorization', token)
            .send({
                title: "Test title",
                isbn: "1234567891011",
                authors: [author.id],
                genres: [genre.id],
                publisher: publisher.id,
                publishDate: new Date()
            })
            .expect(201);

        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: 'Test title',
            isbn: '1234567891011',
            publishDate: expect.any(String),
            authors: expect.arrayContaining([
                expect.objectContaining({
                    id: author.id,
                    name: author.name,
                    birthday: author.birthday.toISOString(),
                })
            ]),
            publisher: expect.objectContaining({
                id: publisher.id,
                title: publisher.title,
                establishedYear: publisher.establishedYear,
            }),
            genres: expect.arrayContaining([
                expect.objectContaining({
                    title: genre.title,
                })
            ]),
            history: expect.any(Array)
        }));
    });

    async function createAndSaveTestUserAdmin(): Promise<UserEntity> {
        const user = new UserEntity();

        user.login = "admin"
        user.password = "admin"
        user.role = "admin"

        return await connection.getRepository(UserEntity).save(user);
    }
    async function createAndSaveTestUser(): Promise<UserEntity> {
        const user = new UserEntity();

        user.login = "user"
        user.password = "user"

        return await connection.getRepository(UserEntity).save(user);
    }
    async function createAndSaveTestAuthor(): Promise<AuthorEntity> {
        const author = new AuthorEntity();
        author.name = 'Test Author';
        author.birthday = new Date();
        return await connection.getRepository(AuthorEntity).save(author);
    }
    async function createAndSaveTestPublisher(): Promise<PublisherEntity> {
        const publisher = new PublisherEntity();
        publisher.title = 'Test Publisher';
        publisher.establishedYear = new Date().getFullYear();
        return await connection.getRepository(PublisherEntity).save(publisher);
    }
    async function createAndSaveTestGenre(): Promise<GenreEntity> {
        const genre = new GenreEntity();
        genre.title = 'Test Genre';
        return await connection.getRepository(GenreEntity).save(genre);
    }
})

async function applyMigration(migration: any, queryRunner: QueryRunner): Promise<void> {
    try {
        await migration.up(queryRunner);
    } catch (error) {
        console.error('Error applying migration:', error);
    }
}
