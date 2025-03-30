import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/roles/entities/roles.entity';
import { AccessControlService } from 'src/shared/access-control.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];

    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      const decodedToken = await this.jwtService.verify(token);
      const userRoles = decodedToken.roles.map(({ role }) => role);

      return userRoles.some((role) =>
        requiredRoles.some((requiredRole) =>
          this.accessControlService.isAuthorized({
            currentRole: role,
            requiredRole,
          }),
        ),
      );
    } catch (error) {
      console.log('Error decoding token:', error);
      return false;
    }
  }
}
