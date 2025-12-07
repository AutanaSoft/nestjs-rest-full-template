import { registerAs } from '@nestjs/config';
import type { Params } from 'nestjs-pino';
import { IncomingMessage } from 'node:http';
import { join } from 'node:path';

/**
 * Describes the configuration required to initialize pino-based HTTP logging.
 *
 * @remarks
 * Values are derived from environment variables prefixed with `LOG_`.
 * @public
 */
export interface LoggerConfig {
  isProduction: boolean;
  logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  logDir: string;
  logMaxSize: number;
  logMaxFiles: number;
  logRotationFrequency?: string;
}

/**
 * Set of automatically redacted paths to avoid exposing sensitive data.
 *
 * @remarks
 * Applied to request and response properties captured by pino.
 */
const SENSITIVE_KEYS: readonly string[] = [
  '*.password',
  '*.*.password',
  '*.*.*.password',
  '*.*.*.*.password',
  '*.authorization',
  '*.*.authorization',
  '*.*.*.authorization',
  '*.*.*.*.authorization',
  '*.cookies',
  '*.*.cookies',
  '*.*.*.cookies',
  '*.*.*.*.cookies',
];

/**
 * Factory function to create the logger configuration.
 *
 * @returns The logger configuration object.
 */
export const loggerConfigFactory = (): LoggerConfig => ({
  isProduction: process.env.NODE_ENV === 'production',
  logLevel: (process.env.LOG_LEVEL as LoggerConfig['logLevel']) ?? 'info',
  logDir: process.env.LOG_DIR ?? join(process.cwd(), 'logs'),
  logMaxSize: Number(process.env.LOG_MAX_SIZE) || 10,
  logMaxFiles: Number(process.env.LOG_MAX_FILES) || 5,
  logRotationFrequency: process.env.LOG_ROTATION_FREQUENCY ?? 'daily',
});

/**
 * Registers the main logger configuration under the `loggerConfig` namespace.
 *
 * @returns Typed configuration built from environment variables.
 */
export default registerAs('loggerConfig', (): LoggerConfig => loggerConfigFactory());

/**
 * Translates the typed configuration into options for `nestjs-pino`.
 *
 * @param config - Logger configuration values.
 * @returns Parameters compatible with the HTTP logging module.
 */
export const createLoggerModuleOptions = (config: LoggerConfig): Params => ({
  pinoHttp: {
    level: config.logLevel,
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          level: config.logLevel,
          options: {
            colorize: true,
            singleLine: true,
            levelFirst: false,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'hostname,pid',
            messageFormat: '[{context}] {msg}',
          },
        },
      ],
    },
    redact: {
      paths: SENSITIVE_KEYS.flatMap((key) => key),
      censor: '[REDACTED]',
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    customProps: (req: IncomingMessage) => ({
      context: req.url ?? 'HTTP',
      correlationId: req.id ?? 'x-correlation-id-not-set',
    }),
  },
});
