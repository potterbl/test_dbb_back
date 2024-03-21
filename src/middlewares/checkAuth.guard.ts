import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../users/users.service";

@Injectable()
export class CheckAuthGuard implements CanActivate{
    constructor(
        private readonly usersService: UsersService
    ) {
    }
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        try {
            const token = request.headers.authorization

            if (!token) {
                throw new UnauthorizedException('Token not provided');
            }

            const user = await this.usersService.getUser({token})

            if(!user) {
                throw new UnauthorizedException("User wasn't found")
            }

            return true
        } catch (e) {
            throw new Error(e)
        }
    }
}
