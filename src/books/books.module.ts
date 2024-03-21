import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookEntity} from "../entities/book.entity";
import {UsersService} from "../users/users.service";
import {UserEntity} from "../entities/user.entity";
import {GenresService} from "../genres/genres.service";
import {GenreEntity} from "../entities/genre.entity";
import {AuthorEntity} from "../entities/author.entity";
import {AuthorsService} from "../authors/authors.service";
import {PublishersService} from "../publishers/publishers.service";
import {PublisherEntity} from "../entities/publisher.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([BookEntity, UserEntity, GenreEntity, AuthorEntity, PublisherEntity]),
  ],
  controllers: [BooksController],
  providers: [BooksService, UsersService, GenresService, AuthorsService, PublishersService],
})
export class BooksModule {}
