import {IsDate, IsNotEmpty, MaxDate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AuthorDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsDate()
    @MaxDate(new Date(), {message: 'Birthday must not be in the future'})
    birthday: Date
}
