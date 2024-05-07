import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const swaggerDocumentBuilder = new DocumentBuilder()
    .setTitle('Online Core Time API')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentBuilder,
  );
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(3000);
}

bootstrap();
