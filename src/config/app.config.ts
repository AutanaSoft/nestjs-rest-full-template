import { registerAs } from '@nestjs/config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interface that defines the application configuration.
 */
export interface AppConfig {
  name: string;
  description: string;
  version: string;
  mode: string;
  logLevel: LogLevel;
  appPrefixEnabled: boolean;
  appPrefix: string;
  server: {
    host: string;
    port: number;
  };
  swagger: {
    enabled: boolean;
    path: string;
  };
}

/**
 * Factory function that creates an application configuration object.
 *
 * @returns An application configuration object.
 */
export const appConfigFactory = (): AppConfig => ({
  name: process.env.APP_NAME ?? 'NestJS REST Full Template',
  description: process.env.APP_DESCRIPTION ?? 'NestJS REST Full Template',
  version: process.env.APP_VERSION ?? '1.0.0',
  mode: process.env.APP_ENV ?? 'development',
  logLevel: (process.env.APP_LOG_LEVEL as LogLevel) ?? 'info',
  appPrefixEnabled: process.env.APP_PREFIX_ENABLED === 'true',
  appPrefix: process.env.API_PREFIX ?? 'v1',
  server: {
    host: process.env.SERVER_HOST ?? 'localhost',
    port: Number(process.env.SERVER_PORT) || 3000,
  },
  swagger: {
    enabled: process.env.APP_SWAGGER_ENABLED === 'true',
    path: process.env.APP_SWAGGER_PATH ?? 'docs',
  },
});

/**
 * Registers the application configuration in the NestJS container.
 */
export default registerAs<AppConfig>('appConfig', (): AppConfig => appConfigFactory());
