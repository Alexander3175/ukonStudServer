import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtUser {
  id: number;
  username: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Authorization header missing',
        });
      }
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Invalid token format or not found token',
        });
      }

      const user = this.jwtService.verify<JwtUser>(token);
      req.user = user;
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException({ message: 'Invalid or expired token' });
    }
  }
}
