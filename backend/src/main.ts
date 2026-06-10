import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({ origin: '*' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Rifas com Estatística — API')
    .setDescription('Plataforma acadêmica de rifas virtuais para estudo de Probabilidade e Estatística')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Rifas com Estatística backend rodando em: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger disponível em: http://localhost:${process.env.PORT ?? 3000}/api`);
}

bootstrap();
