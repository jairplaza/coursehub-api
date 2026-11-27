import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener el ConfigService y el puerto configurado
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  // Versionado por URI (debe ir antes de SwaggerModule.createDocument)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Pipe global de validación y transformación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global de errores
  app.useGlobalFilters(new HttpErrorFilter());

  // Interceptores globales (serialización y tiempo de respuesta)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TimingInterceptor(),
  );

  // Interfaz OpenAPI / Swagger en entornos distintos a producción
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('CourseHub API')
      .setDescription('API de cursos, estudiantes e inscripciones')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido en /v1/auth/login',
        },
        'bearer',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
