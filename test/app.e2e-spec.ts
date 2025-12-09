import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from '@/app.module';
import { appConfigFactory } from '@/config/app.config';
import { corsConfigFactory } from '@/config/cors.config';
import { serializationConfigFactory } from '@/config/serialization.config';
import { validationConfigFactory } from '@/config/validation.config';
import helmet from '@fastify/helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { healthControllerTest } from './modules/health/health.spec';
import { authControllerTest } from './modules/auth/auth.controller.spec';

describe('App (e2e)', () => {
  let app: NestFastifyApplication;

  /**
   * Initializes the application before all tests.
   * Use specific port and host from configuration to ensure consistency.
   */
  beforeAll(async () => {
    // Initialize the module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Initialize the application
    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    // App config
    const config = appConfigFactory();

    // Configure global prefix
    if (config.appPrefixEnabled) {
      app.setGlobalPrefix(config.appPrefix);
    }

    // Configure security (Helmet)
    await app.register(helmet);

    // Configure CORS
    app.enableCors(corsConfigFactory());

    // Configure the application
    app.useGlobalPipes(new ValidationPipe(validationConfigFactory()));

    // Configure serialization
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), serializationConfigFactory()),
    );

    // Start the server
    await app.listen(config.server.port, config.server.host);

    // Initialize the server
    await app.getHttpAdapter().getInstance().ready();
  });

  /**
   * Closes the application after all tests.
   */
  afterAll(async () => {
    await app.close();
  });

  // Test suites
  healthControllerTest(() => app);
  authControllerTest(() => app);
});
