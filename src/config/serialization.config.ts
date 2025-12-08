import { registerAs } from '@nestjs/config';
import { ClassSerializerContextOptions } from '@nestjs/common';

/**
 * Factory that generates the Serialization configuration.
 *
 * @returns ClassSerializerContextOptions object.
 */
export const serializationConfigFactory = (): ClassSerializerContextOptions => ({
  excludeExtraneousValues: true,
  enableCircularCheck: true,
  exposeDefaultValues: true,
});

/**
 * Registration of the Serialization configuration in the NestJS container.
 */
export default registerAs<ClassSerializerContextOptions>(
  'serializationConfig',
  (): ClassSerializerContextOptions => serializationConfigFactory(),
);
