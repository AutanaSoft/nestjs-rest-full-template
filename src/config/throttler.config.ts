import { registerAs } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Interface that defines the Throttler (Rate Limiting) configuration options.
 */
export interface ThrottlerConfig {
  ttl: number;
  limit: number;
}

/**
 * Factory that generates the Throttler configuration from environment variables.
 *
 * @returns Throttler configuration object.
 */
export const throttlerConfigFactory = (): ThrottlerConfig => ({
  ttl: Number(process.env.THROTTLE_TTL) || 60000,
  limit: Number(process.env.THROTTLE_LIMIT) || 10,
});

/**
 * Registration of the Throttler configuration in the NestJS container.
 */
export default registerAs<ThrottlerConfig>(
  'throttlerConfig',
  (): ThrottlerConfig => throttlerConfigFactory(),
);

/**
 * Creates the ThrottlerModuleOptions object based on the ThrottlerConfig.
 *
 * @param config - The ThrottlerConfig object.
 * @returns The ThrottlerModuleOptions object.
 */
export const createThrottlerModuleOptions = (config: ThrottlerConfig): ThrottlerModuleOptions => ({
  throttlers: [
    {
      ttl: config.ttl,
      limit: config.limit,
    },
  ],
});
