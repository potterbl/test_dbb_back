import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PublisherEntity} from "../entities/publisher.entity";
import {Repository} from "typeorm";
import {PublisherDto} from "../dto/publisher.dto";
import {GenreEntity} from "../entities/genre.entity";

@Injectable()
export class PublishersService {

    constructor(
        @InjectRepository(PublisherEntity)
        private publisherRepo: Repository<PublisherEntity>
    ) {
    }

    async create(publisherDto: PublisherDto): Promise<PublisherEntity> {
        try {
            const newPublisher = new PublisherEntity()

            newPublisher.title = publisherDto.title
            newPublisher.establishedYear = publisherDto.establishedYear

            return await this.publisherRepo.save(newPublisher)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getPublisher(id: number): Promise<PublisherEntity>{
        try {
            const candidate = this.publisherRepo.findOne({
                where: {
                    id: id
                }
            })

            return candidate
        } catch (e) {
            throw new Error(e)
        }
    }

    async getAll(): Promise<PublisherEntity[]>{
        try {
            return await this.publisherRepo.find({relations: ["books"]})
        } catch (e) {
            throw new Error(e)
        }
    }
}
