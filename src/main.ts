import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.useStaticAssets('uploads', {
    prefix: '/uploads/',
  });

  await app.listen(port, () => {
    console.log('Example run with port', `${port}`);
  });
}
bootstrap();
