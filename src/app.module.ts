import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "dotenv";
import { BookEntity } from "./entities/book.entity";
import { GenreEntity } from "./entities/genre.entity";
import { AuthorEntity } from "./entities/author.entity";
import { UserEntity } from "./entities/user.entity";
import { PublishersModule } from './publishers/publishers.module';
import { PublisherEntity } from "./entities/publisher.entity";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [BookEntity, GenreEntity, AuthorEntity, UserEntity, PublisherEntity],
      synchronize: true
    }),
    AuthorsModule,
    BooksModule,
    UsersModule,
    GenresModule,
    PublishersModule
  ],
})
export class AppModule {

}
