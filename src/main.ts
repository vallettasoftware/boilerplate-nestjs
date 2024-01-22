import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from './config/config.type';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoLoggerService } from './logger/pino-logger.service';
import { NextFunction } from 'express';
import { ASYNC_STORAGE } from './logger/logger.constants';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(PinoLoggerService));
  const config = app.get(ConfigService<AppConfigType>);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableShutdownHooks();
  app.setGlobalPrefix(config.getOrThrow('main.apiPrefix', { infer: true }));
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    const asyncStorage = app.get(ASYNC_STORAGE);
    const traceId = req.headers['x-request-id'] || uuidv4();
    const store = new Map().set('traceId', traceId);
    asyncStorage.run(store, () => {
      next();
    });
  });

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(config.getOrThrow('main.port', { infer: true }));

  process.on('unhandledRejection', async () => {
    await app.close();
    process.exit(1);
  });
}
void bootstrap();
