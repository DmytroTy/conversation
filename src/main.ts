import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { LoggerWinston } from './logger/logger-winston.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  app.useLogger(app.get(LoggerWinston));

  app.useStaticAssets(join(__dirname, '..', 'static'));

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
