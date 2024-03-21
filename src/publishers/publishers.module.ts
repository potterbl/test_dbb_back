import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PublisherEntity} from "../entities/publisher.entity";
import {UserEntity} from "../entities/user.entity";
import {UsersService} from "../users/users.service";

@Module({
  controllers: [PublishersController],
  providers: [PublishersService, UsersService],
  imports: [
      TypeOrmModule.forFeature([PublisherEntity, UserEntity])
  ]
})
export class PublishersModule {}
