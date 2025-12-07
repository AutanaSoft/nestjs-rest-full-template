import { appConfigFactory } from '@config/app.config';
import { corsConfigFactory } from '@config/cors.config';
import helmet from '@fastify/helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
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
  // Obtener servicio de configuración
  const _appConfig = appConfigFactory();
  const _corsConfig = corsConfigFactory();
  const fastifyAdapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
    bufferLogs: true,
  });

  // Configurar logger
  const logger = app.get(Logger);
  app.useLogger(logger);

  if (!_appConfig) {
    throw new Error('App config not found');
  }

  // Configurar prefijo global
  if (_appConfig.appPrefixEnabled) {
    app.setGlobalPrefix(_appConfig.appPrefix);
  }

  // Configurar seguridad (Helmet)
  await app.register(helmet);

  // Configurar CORS
  if (_corsConfig) {
    app.enableCors(_corsConfig);
  }

  // Configurar Swagger
  if (_appConfig.swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(_appConfig.name)
      .setDescription(_appConfig.description)
      .setVersion(_appConfig.version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(_appConfig.swagger.path, app, document);
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

  await app.listen(_appConfig.server.port, _appConfig.server.host);
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
