import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
async function bootstrap() {
  const PORT = process.env.PORT ?? 3175;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['OPTIONS', 'POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'X-CSRF-Token',
      'X-Requested-With',
      'Accept',
      'Accept-Version',
      'Content-Length',
      'Content-MD5',
      'Date',
      'X-Api-Version',
      'X-File-Name',
      'authorization',
      'access_token',
      'pre-release',
      'Sec-WebSocket-Key',
      'Sec-WebSocket-Extensions',
      'Sec-WebSocket-Accept',
      'Sec-WebSocket-Protocol',
    ],
  });
  app.use(cookieParser());
  app.use(
    session({
      secret: 'QWEQWEQWEQWEQWEQWEQWEQWEQWE',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(PORT, () => console.log(`${PORT}`));
}
bootstrap();
