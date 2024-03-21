import {ApiProperty} from "@nestjs/swagger";

export class GenreDto{
    @ApiProperty()
    title: string;
}
