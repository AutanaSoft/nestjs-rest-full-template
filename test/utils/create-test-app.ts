import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { validationConfigFactory } from '../../src/config/validation.config';
import { serializationConfigFactory } from '../../src/config/serialization.config';
import { AppModule } from '../../src/app.module';

/**
 * Interface for test application configuration options.
 */
interface CreateTestAppOptions {
  /**
   * Function to configure the TestingModuleBuilder before compilation.
   * Useful for overriding providers or ignoring modules.
   */
  configureBuilder?: (builder: TestingModuleBuilder) => void;
}

/**
 * Creates and initializes a NestJS application for E2E testing.
 *
 * @param options - Configuration options for the test app
 * @returns A promise that resolves to the initialized NestFastifyApplication
 */
export async function createTestApp(
  options: CreateTestAppOptions = {},
): Promise<NestFastifyApplication> {
  const builder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (options.configureBuilder) {
    options.configureBuilder(builder);
  }

  const moduleFixture = await builder.compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe(validationConfigFactory()));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), serializationConfigFactory()),
  );

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}
