import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {AuthorEntity} from "../entities/author.entity";
import {Repository} from "typeorm";
import {AuthorDto} from "../dto/author.dto";

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(AuthorEntity)
        private authorsRepo: Repository<AuthorEntity>
    ) {
    }

    async getAuthor(id: number) {
        try {
            const candidate = await this.authorsRepo.findOne({
                where: {
                    id: id
                },
                relations: ["books"]
            })

            if(!candidate) throw new NotFoundException("Author wasn't found")

            return candidate
        } catch (e) {
            throw new Error(e)
        }
    }

    async getBooks(id: number) {
        try {
            const candidate = await this.authorsRepo.findOne({
                where: { id: id },
                relations: ['books', 'books.authors', 'books.publisher', 'books.genres']
            });

            if (!candidate) throw new NotFoundException("Author wasn't found");

            return candidate.books;
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw e;
            } else {
                throw new Error(e);
            }
        }
    }


    async create(authorDto: AuthorDto){
        try {
            const newAuthor = new AuthorEntity()

            newAuthor.name = authorDto.name
            newAuthor.birthday = authorDto.birthday

            return await this.authorsRepo.save(newAuthor)
        } catch (e) {
            throw new Error(e)
        }
    }
}
