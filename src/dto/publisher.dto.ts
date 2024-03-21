import { ApiProperty } from '@nestjs/swagger';
import { Max } from 'class-validator';

export class PublisherDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    @Max(new Date().getFullYear(), { message: "Established year can't be in future" })
    establishedYear: number;
}
