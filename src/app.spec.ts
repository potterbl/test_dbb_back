import {AppModule} from "./app.module";
import {Test, TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {Connection, QueryRunner} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {AuthorEntity} from "./entities/author.entity";
import {BookEntity, IHistory} from "./entities/book.entity";
import {PublisherEntity} from "./entities/publisher.entity";
import {GenreEntity} from "./entities/genre.entity";
import {ClearDatabase1711051256678} from "./migrations/1711051256678-ClearDatabase";

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
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
        await connection.close();
        await app.close();
    });

    beforeEach(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
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
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
        await connection.close();
        await app.close();
    });

    beforeEach(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
    })

    it('/books (GET) - Get paginated and sorted list of books', async () => {
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();
        await createAndSaveTestBook(author, publisher, genre);
        await createAndSaveTestBook(author, publisher, genre);
        await createAndSaveTestBook(author, publisher, genre);

        const response = await request(app.getHttpServer())
            .get('/books')
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);

        expect(response.body.length).toBe(3); // Assuming there are only 3 test books in the database

        expect(response.body[0].id).toBeLessThan(response.body[1].id);
        expect(response.body[1].id).toBeLessThan(response.body[2].id);
    });

    it('/books (GET) - Get paginated and sorted list of books with custom parameters', async () => {
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();
        await createAndSaveTestBook(author, publisher, genre);
        await createAndSaveTestBook(author, publisher, genre);
        await createAndSaveTestBook(author, publisher, genre);

        const response = await request(app.getHttpServer())
            .get('/books')
            .query({
                page: 2,
                limit: 2,
                sortBy: 'title',
                sortOrder: 'DESC'
            })
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);

        expect(response.body.length).toBe(1);
    });

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

        return await request(app.getHttpServer())
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
            .expect(401);
    });

    it('/books/{:id}/history (POST) [EMPTY]', async () => {
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();
        const book = await createAndSaveTestBook(author, publisher, genre)

        return await request(app.getHttpServer())
            .get(`/books/${book.id}/history`)
            .expect(200)
            .expect([])
    });

    it('/books/{:id}/history (POST) [NOT EMPTY]', async () => {
        const user = await createAndSaveTestUser()
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();
        const book = await createAndSaveTestBook(author, publisher, genre, {
            User: user,
            DateBorrow: new Date(),
            DateReturn: null
        }, user)

        const response = await request(app.getHttpServer())
            .get(`/books/${book.id}/history`)
            .expect(200);

        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toEqual(expect.objectContaining({
            User: expect.objectContaining({
                id: expect.any(Number),
                role: expect.any(String),
            }),
            DateBorrow: expect.any(String),
            DateReturn: null
        }));
    });

    it('/books/borrow (POST)', async () => {
        const user = await createAndSaveTestUser();
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();
        const book = await createAndSaveTestBook(author, publisher, genre);

        const tokenResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: user.login,
                password: user.password
            });

        const token = tokenResponse.body.token;

        return await request(app.getHttpServer())
            .post('/books/borrow')
            .set('Authorization', token)
            .send({
                book: book.id
            })
            .expect(201);
    });

    it('/books/return (POST)', async () => {
        const user = await createAndSaveTestUser();
        const author = await createAndSaveTestAuthor();
        const genre = await createAndSaveTestGenre();
        const publisher = await createAndSaveTestPublisher();
        const book = await createAndSaveTestBook(author, publisher, genre);

        const tokenResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: user.login,
                password: user.password
            });

        const token = tokenResponse.body.token;

        await request(app.getHttpServer())
            .post('/books/borrow')
            .set('Authorization', token)
            .send({
                book: book.id
            })
            .expect(201);

        return await request(app.getHttpServer())
            .post('/books/return')
            .set('Authorization', token)
            .send({
                book: book.id
            })
            .expect(201);
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
        user.books = []

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
    async function createAndSaveTestBook(author: AuthorEntity, publisher: PublisherEntity, genre: GenreEntity, history?: IHistory, user?: UserEntity): Promise<BookEntity> {
        const book = new BookEntity();
        book.title = 'some title';
        book.isbn = '1234567891011';
        book.authors = [author];
        book.publisher = publisher;
        book.genres = [genre];
        book.publishDate = new Date();
        if(history){
            book.history = [history]
            book.currentUser = user
        } else {
            book.history = []
            book.currentUser = null
        }
        return await connection.getRepository(BookEntity).save(book);
    }
})

describe('Auth controller', () => {
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
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
        await connection.close();
        await app.close();
    });

    beforeEach(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
    })

    it('/auth/sign (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/sign')
            .send({
                login: "test login",
                password: "test password",
            })
            .expect(201)

        return expect(response.body).toEqual(expect.objectContaining({
            token: expect.any(String)
        }));
    })

    it('/auth/login (POST)', async () => {
        const user = await createAndSaveTestUser();
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: user.login,
                password: user.password
            })
            .expect(201)

        return expect(response.body).toEqual(expect.objectContaining({
            token: expect.any(String)
        }));
    })

    async function createAndSaveTestUser(): Promise<UserEntity> {
        const user = new UserEntity();

        user.login = "user"
        user.password = "user"

        return await connection.getRepository(UserEntity).save(user);
    }
})

describe('Genres controller', () => {
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
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
        await connection.close();
        await app.close();
    });

    beforeEach(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
    })

    it('/genres (POST)', async () => {
        const admin = await createAndSaveTestUserAdmin()

        const tokenResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: admin.login,
                password: admin.password
            })
            .expect(201)

        const token = tokenResponse.body.token

        return await request(app.getHttpServer())
            .post('/genres')
            .set('Authorization', token)
            .send({
                title: "test"
            })
            .expect(201)
    })

    async function createAndSaveTestUserAdmin(): Promise<UserEntity> {
        const user = new UserEntity();

        user.login = "admin"
        user.password = "admin"
        user.role = "admin"

        return await connection.getRepository(UserEntity).save(user);
    }
})

describe('Publishers controller', () => {
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
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
        await connection.close();
        await app.close();
    });

    beforeEach(async () => {
        const queryRunner = connection.createQueryRunner();
        try {
            await applyMigration(new ClearDatabase1711051256678(), queryRunner);
        } finally {
            await queryRunner.release();
        }
    })

    it('/publishers (POST)', async () => {
        const admin = await createAndSaveTestUserAdmin()

        const tokenResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: admin.login,
                password: admin.password
            })
            .expect(201)

        const token = tokenResponse.body.token

        return await request(app.getHttpServer())
            .post('/publishers')
            .set('Authorization', token)
            .send({
                title: "test",
                establishedYear: new Date().getFullYear()
            })
            .expect(201)
    })

    it('/publishers (GET) [EMPTY]', async () => {
        return await request(app.getHttpServer())
            .get('/publishers')
            .expect(200)
            .expect([])
    })


    it('/publishers (GET) [BOT EMPTY]', async () => {
        const admin = await createAndSaveTestUserAdmin()

        const tokenResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                login: admin.login,
                password: admin.password
            })
            .expect(201)

        const token = tokenResponse.body.token

        await request(app.getHttpServer())
            .post('/publishers')
            .set('Authorization', token)
            .send({
                title: "test",
                establishedYear: new Date().getFullYear()
            })
            .expect(201)

        const response = await request(app.getHttpServer())
            .get('/publishers')
            .expect(200)

        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toEqual(expect.objectContaining({
            books: expect.any(Array),
            establishedYear: expect.any(Number),
            id: expect.any(Number),
            title: expect.any(String)
        }));
    })

    async function createAndSaveTestUserAdmin(): Promise<UserEntity> {
        const user = new UserEntity();

        user.login = "admin"
        user.password = "admin"
        user.role = "admin"

        return await connection.getRepository(UserEntity).save(user);
    }
})

async function applyMigration(migration: any, queryRunner: QueryRunner): Promise<void> {
    try {
        await migration.up(queryRunner);
    } catch (error) {
        console.error('Error applying migration:', error);
    }
}
