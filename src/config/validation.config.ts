import { registerAs } from '@nestjs/config';
import { ValidationPipeOptions } from '@nestjs/common';

/**
 * Factory that generates the Validation configuration.
 *
 * @returns ValidationPipeOptions object.
 */
export const validationConfigFactory = (): ValidationPipeOptions => ({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});

/**
 * Registration of the Validation configuration in the NestJS container.
 */
export default registerAs<ValidationPipeOptions>(
  'validationConfig',
  (): ValidationPipeOptions => validationConfigFactory(),
);
