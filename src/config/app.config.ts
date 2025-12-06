import { registerAs } from '@nestjs/config';

/**
 * Niveles de log soportados por la aplicación.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interfaz que define la estructura de configuración de la aplicación.
 */
export interface AppConfig {
  name: string;
  description: string;
  version: string;
  mode: string;
  logLevel: LogLevel;
  server: {
    host: string;
    port: number;
  };
}

/**
 * Fábrica que genera la configuración de la aplicación a partir de variables de entorno.
 *
 * @returns Objeto de configuración de la aplicación.
 */
export const appConfigFactory = (): AppConfig => ({
  name: process.env.APP_NAME ?? 'NestJS REST Full Template',
  description: process.env.APP_DESCRIPTION ?? 'NestJS REST Full Template',
  version: process.env.APP_VERSION ?? '1.0.0',
  mode: process.env.APP_ENV ?? 'development',
  logLevel: (process.env.APP_LOG_LEVEL as LogLevel) ?? 'info',
  server: {
    host: process.env.SERVER_HOST ?? '0.0.0.0',
    port: Number(process.env.SERVER_PORT) || 3000, // Keep || for port to handle NaN if env is empty string, though ?? is safer if we trust Number() behavior unrelated to this specific lint rule which usually prefers ??
  },
});

/**
 * Registro de la configuración de la aplicación en el contenedor de NestJS.
 */
export default registerAs<AppConfig>('appConfig', (): AppConfig => appConfigFactory());
