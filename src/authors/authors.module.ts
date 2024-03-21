import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthorEntity} from "../entities/author.entity";
import {UsersService} from "../users/users.service";
import {UserEntity} from "../entities/user.entity";

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, UsersService],
  imports: [
      TypeOrmModule.forFeature([AuthorEntity, UserEntity])
  ]
})
export class AuthorsModule {}
