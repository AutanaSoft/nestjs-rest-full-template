import { AppConfig } from '@config/app.config';
import { CorsConfig } from '@config/cors.config';
import helmet from '@fastify/helmet';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Inicializa la aplicación NestJS.
 *
 * Configura el logger global, carga la configuración de la aplicación
 * e inicia el servidor HTTP escuchando en el host y puerto definidos
 * en la configuración.
 *
 * @returns Promesa que se resuelve cuando la aplicación se ha iniciado.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  // Configurar logger
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);

  // Obtener servicio de configuración
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('appConfig');
  const corsConfig = configService.get<CorsConfig>('corsConfig');

  if (!appConfig) {
    throw new Error('App config not found');
  }

  // Configurar prefijo global
  if (appConfig.appPrefixEnabled) {
    app.setGlobalPrefix(appConfig.appPrefix);
  }

  // Configurar seguridad (Helmet)
  await app.register(helmet);

  // Configurar CORS
  if (corsConfig) {
    app.enableCors(corsConfig);
  }

  // Configurar Swagger
  if (appConfig.swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setDescription(appConfig.description)
      .setVersion(appConfig.version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(appConfig.swagger.path, app, document);
  }

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar interceptor de serialización global
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  await app.listen(appConfig.server.port, appConfig.server.host);
  logger.log(`Server is running on port ${await app.getUrl()}`);
}

/**
 * Ejecuta el proceso de inicialización de la aplicación.
 *
 * Maneja cualquier error no capturado durante el arranque, registrándolo
 * en la consola y terminando el proceso con un código de error (1).
 */
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
