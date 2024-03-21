import {UserEntity} from "../entities/user.entity";
import {IHistory} from "../entities/book.entity";
import {IsDate, MaxDate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class BookDto {
    @ApiProperty()
    title: string;
    @ApiProperty()
    isbn: string;
    @ApiProperty()
    authors: number[]
    @ApiProperty()
    genres: number[]
    @ApiProperty()
    currentUser: UserEntity
    @ApiProperty()
    publisher: number
    @ApiProperty()
    history: IHistory[]
    @ApiProperty()
    @IsDate()
    @MaxDate(new Date(), {message: 'Publish date must not be in the future'})
    publishDate: Date
}
