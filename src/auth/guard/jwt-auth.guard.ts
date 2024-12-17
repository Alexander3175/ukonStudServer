import { ConfigService } from '@nestjs/config';
import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'Authorization header missing',
      });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Invalid token format or token not found',
      });
    }

    try {
      const secret = this.configService.get<string>('SECRET_ACCESSKEY');
      const user = this.jwtService.verify(token, { secret });
      req.user = user;
      return true;
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException({ message: 'Invalid or expired token' });
    }
  }
}
