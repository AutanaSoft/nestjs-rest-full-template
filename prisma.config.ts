import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { databaseConfigFactory } from './src/config/database.config';

const { baseDir, driver, host, port, user, password, name } = databaseConfigFactory();

export default defineConfig({
  schema: baseDir,
  migrations: {
    path: path.join(baseDir, 'migrations'),
    seed: path.join(baseDir, 'seeds/index.ts'),
  },
  datasource: {
    url: `${driver}://${user}:${password}@${host}:${port}/${name}?schema=public`,
  },
});
