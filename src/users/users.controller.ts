import {Body, Controller, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import {UserDto} from "../dto/user.dto";

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign')
  async sign(@Body() userDto: UserDto){
    return await this.usersService.createUser(userDto)
  }

  @Post('/login')
  async login(@Body() userDto: UserDto){
    return await this.usersService.login(userDto)
  }


}
