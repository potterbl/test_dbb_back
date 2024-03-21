import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {GenreEntity} from "../entities/genre.entity";
import {UsersService} from "../users/users.service";
import {UserEntity} from "../entities/user.entity";

@Module({
  controllers: [GenresController],
  providers: [GenresService, UsersService],
  imports: [
      TypeOrmModule.forFeature([GenreEntity, UserEntity])
  ]
})
export class GenresModule {}
