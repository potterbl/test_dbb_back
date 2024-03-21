import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PublisherEntity} from "../entities/publisher.entity";
import {Repository} from "typeorm";
import {PublisherDto} from "../dto/publisher.dto";

@Injectable()
export class PublishersService {

    constructor(
        @InjectRepository(PublisherEntity)
        private publisherRepo: Repository<PublisherEntity>
    ) {
    }

    async create(publisherDto: PublisherDto) {
        try {
            const newPublisher = new PublisherEntity()

            newPublisher.title = publisherDto.title
            newPublisher.establishedYear = publisherDto.establishedYear

            return await this.publisherRepo.save(newPublisher)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getPublisher(id: number){
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

    async getAll(){
        try {
            return await this.publisherRepo.find({relations: ["books"]})
        } catch (e) {
            throw new Error(e)
        }
    }
}
