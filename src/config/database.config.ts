import { registerAs } from '@nestjs/config';

/**
 * Interface that defines the database configuration.
 */
export interface DatabaseConfig {
  connectionString: string;
}

/**
 * Factory function that creates a database configuration object.
 *
  @returns A database configuration object.
 */
export const databaseConfigFactory = (): DatabaseConfig => {
  const _dbUrl = process.env.DATABASE_URL;
  if (!_dbUrl) {
    throw new Error('DATABASE_URL is not defined');
  }
  return { connectionString: _dbUrl };
};

/**
 * Registers the database configuration in the NestJS container.
 */
export default registerAs<DatabaseConfig>(
  'databaseConfig',
  (): DatabaseConfig => databaseConfigFactory(),
);
