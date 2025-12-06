import { registerAs } from '@nestjs/config';

/**
 * Interface that defines the CORS configuration options.
 */
export interface CorsConfig {
  enabled: boolean;
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

/**
 * Factory that generates the CORS configuration from environment variables.
 *
 * @returns CORS configuration object.
 */
export const corsConfigFactory = (): CorsConfig => ({
  enabled: process.env.CORS_ENABLED === 'true',
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: process.env.CORS_METHODS
    ? process.env.CORS_METHODS.split(',')
    : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS
    ? process.env.CORS_ALLOWED_HEADERS.split(',')
    : ['Content-Type', 'Authorization'],
  exposedHeaders: process.env.CORS_EXPOSED_HEADERS
    ? process.env.CORS_EXPOSED_HEADERS.split(',')
    : [],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  maxAge: Number(process.env.CORS_MAX_AGE) || 3600,
});

/**
 * Registration of the CORS configuration in the NestJS container.
 */
export default registerAs<CorsConfig>('corsConfig', (): CorsConfig => corsConfigFactory());
