import {ApiProperty} from "@nestjs/swagger";

export class UserDto{
    @ApiProperty()
    login: string
    @ApiProperty()
    password: string
}
