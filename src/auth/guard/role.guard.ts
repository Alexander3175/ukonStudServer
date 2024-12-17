import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/roles/entities/roles.entity';
import Users from 'src/users/entities/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: UserRoles[] = this.reflector.get<UserRoles[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: Users = request.user;
    if (!user || !user.roles) {
      throw new ForbiddenException('User roles are not defined.');
    }

    const userRoles = user.roles.map((role) => role.role);

    if (!userRoles.some((role) => requiredRoles.includes(role))) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
