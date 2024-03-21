import { Injectable, UnauthorizedException, ExecutionContext, CanActivate } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class CheckRoleGuard implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            const token = request.headers.authorization;

            if (!token) {
                throw new UnauthorizedException('Token not provided');
            }

            const role = await this.userService.checkRole(token);

            if (role !== 'admin') {
                throw new UnauthorizedException("You don't have permission");
            }

            return true;
        } catch (e) {
            throw new UnauthorizedException(e.message);
        }
    }
}
