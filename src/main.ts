import { appConfigFactory } from '@config/app.config';
import { corsConfigFactory } from '@config/cors.config';
import { validationConfigFactory } from '@config/validation.config';
import helmet from '@fastify/helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

/**
 * Initializes the NestJS application.
 *
 * Configures the global logger, loads the application configuration,
 * and starts the HTTP server listening on the host and port defined
 * in the configuration.
 *
 * @returns Promise that resolves when the application has started.
 */
async function bootstrap() {
  // Get configuration service
  const _appConfig = appConfigFactory();
  const _corsConfig = corsConfigFactory();
  const fastifyAdapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
    bufferLogs: true,
  });

  // Configure logger
  const logger = app.get(Logger);
  app.useLogger(logger);

  if (!_appConfig) {
    throw new Error('App config not found');
  }

  // Configure global prefix
  if (_appConfig.appPrefixEnabled) {
    app.setGlobalPrefix(_appConfig.appPrefix);
  }

  // Configure security (Helmet)
  await app.register(helmet);

  // Configure CORS
  if (_corsConfig) {
    app.enableCors(_corsConfig);
  }

  // Configure Swagger
  if (_appConfig.swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(_appConfig.name)
      .setDescription(_appConfig.description)
      .setVersion(_appConfig.version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(_appConfig.swagger.path, app, document);
  }

  // Configure global validation
  app.useGlobalPipes(new ValidationPipe(validationConfigFactory()));

  // Configure global serialization interceptor
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  await app.listen(_appConfig.server.port, _appConfig.server.host);
  logger.log(`Server is running on port ${await app.getUrl()}`);
}

/**
 * Executes the application initialization process.
 *
 * Handles any uncaught errors during startup, logging them
 * to the console and terminating the process with an error code (1).
 */
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
