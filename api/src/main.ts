import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  const config = app.get(ConfigService);
  const port = config.get<number>('port');
  await app.listen(port, '0.0.0.0');
  console.log(`API rodando em http://localhost:${port}`);
}
bootstrap();
