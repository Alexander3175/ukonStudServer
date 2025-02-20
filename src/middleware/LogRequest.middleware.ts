import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('Content-Length:', req.headers['content-length']);
    next();
  }
}
