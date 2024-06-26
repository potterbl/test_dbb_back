import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {GenreEntity} from "../entities/genre.entity";
import {Repository} from "typeorm";
import {GenreDto} from "../dto/genre.dto";
import {AuthorEntity} from "../entities/author.entity";

@Injectable()
export class GenresService {

    constructor(
        @InjectRepository(GenreEntity)
        private genreRepo: Repository<GenreEntity>
    ) {

    }

    async getGenre(id: number): Promise<GenreEntity>{
        try {
            const genreCandidate = await this.genreRepo.findOne({
                where: {
                    id: id
                }
            })

            if(!genreCandidate) throw new NotFoundException("Genre wasn't found")

            return genreCandidate
        } catch (e) {
            throw new Error(e)
        }
    }

    async create (genreDto: GenreDto): Promise<GenreEntity> {
        try {
            const newGenre = new GenreEntity()

            newGenre.title = genreDto.title

            return await this.genreRepo.save(newGenre)
        } catch (e) {
            throw new Error(e)
        }
    }
}
