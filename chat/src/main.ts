import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: '*',
    // credentials: true,
  });

  const port = configService.get<number>('PORT');
  // await app.listen(port, '0.0.0.0', () => {
  //   logger.log(`Socket server is running on port ${port}`);
  // });
  await app.listen(port);
}
bootstrap();