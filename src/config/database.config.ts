import { registerAs } from '@nestjs/config';
import path from 'node:path';

/**
 * Interface that defines the database configuration.
 */
export interface DatabaseConfig {
  baseDir: string;
  driver: string;
  host: string;
  port: number;
  user: string;
  password?: string;
  name: string;
}

/**
 * Factory function that creates a database configuration object.
 *
 * @returns A database configuration object.
 */
export const databaseConfigFactory = (): DatabaseConfig => ({
  baseDir: path.join('src', 'modules', 'database'),
  driver: process.env.DB_DRIVER ?? 'postgresql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME ?? 'postgres',
});

/**
 * Registers the database configuration in the NestJS container.
 */
export default registerAs<DatabaseConfig>(
  'databaseConfig',
  (): DatabaseConfig => databaseConfigFactory(),
);
