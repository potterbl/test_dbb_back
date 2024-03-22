import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BookEntity, IHistory} from "../entities/book.entity";
import {Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {BookDto} from "../dto/book.dto";
import {GenresService} from "../genres/genres.service";
import {AuthorsService} from "../authors/authors.service";
import {config} from "dotenv";
import {PublishersService} from "../publishers/publishers.service";
config()

@Injectable()
export class BooksService {

    constructor(
        @InjectRepository(BookEntity)
        private bookRepo: Repository<BookEntity>,
        private usersService: UsersService,
        private genresService: GenresService,
        private authorsService: AuthorsService,
        private publishersService: PublishersService,
    ) {
    }

    async create(bookDto: BookDto): Promise<BookEntity>{
        try {
            if(!(bookDto.isbn.length === 13)) throw new Error("ISBN isn't correct")
            if(!bookDto.publisher) throw new ConflictException("Publisher can't be null")

            const newBook = new BookEntity()

            if(bookDto.authors.length > 0){
                newBook.authors = []
                bookDto.authors.map(async (id) => {
                    const author = await this.authorsService.getAuthor(id)

                    if(!author) throw new NotFoundException("Author doesn't exist")

                    newBook.authors.push(author)
                })
            } else {
                throw new ConflictException("Authors can't be null")
            }
            newBook.title = bookDto.title
            newBook.isbn = bookDto.isbn
            newBook.publishDate = bookDto.publishDate
            newBook.publisher = await this.publishersService.getPublisher(bookDto.publisher)
            newBook.history = []
            if(bookDto.genres.length > 0){
                newBook.genres = []
                bookDto.genres.map(async (id) => {
                    const genre = await this.genresService.getGenre(id)

                    if (!newBook.genres.includes(genre)) newBook.genres.push(genre)
                })
            }

            return await this.bookRepo.save(newBook)
        } catch (e) {
            throw new Error(e)
        }
    }

    async borrowBook(bookId: number, token: string): Promise<BookEntity>{
        try {
            const user = await this.usersService.getUser({token: token})

            const book = await this.bookRepo.findOne({
                where: {
                    id: bookId
                },
                relations: ["currentUser"]
            })

            if(!user || !book) throw new NotFoundException("Something wasn't found")

            if(book.currentUser !== null ) throw new ConflictException("Book in rent now")

            if(user.books.length && user.books.length >= parseInt(process.env.BORROWING_LIMIT)) throw new ConflictException("Maximum count for borrowing reached")

            await this.usersService.addBookToUser(book, user.id)

            book.currentUser = user

            book.history.push({User: user, DateBorrow: new Date(), DateReturn: null})

            return await this.bookRepo.save(book)
        } catch (e) {
            throw e
        }
    }

    async returnBook(bookId: number, token: string): Promise<BookEntity>{
        try {
            const user = await this.usersService.getUser({token: token})

            const book = await this.bookRepo.findOne({
                where: {
                    id: bookId
                }
            })

            if(!user || !book) throw new NotFoundException("Something wasn't found")

            const userRent = book.history.find(entry => entry.User.id === user.id && entry.DateReturn === null)

            userRent.DateReturn = new Date()

            book.currentUser = null

            await this.usersService.removeBookToUser(book, user.id)

            return await this.bookRepo.save(book)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getHistory(bookId: number): Promise<IHistory[]>{
        try {
            const book = await this.bookRepo.findOne({
                where: {
                    id: bookId
                }
            })

            if(!book) throw new NotFoundException("Book wasn't found")

            book.history.forEach(entry => {
                delete entry.User.login;
                delete entry.User.password;
            });

            return book.history
        } catch (e) {
            throw e
        }
    }

    async getAll(
        page: number,
        limit: number,
        sortBy: string,
        sortOrder: 'ASC' | 'DESC',
    ): Promise<BookEntity[]> {
        try {
            const skip = (page - 1) * limit;
            return await this.bookRepo.find({
                order: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit,
            });
        } catch (e) {
            throw e;
        }
    }
}
