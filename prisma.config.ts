import 'dotenv/config';
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

const _baseDir = path.join('src', 'modules', 'database', 'infrastructure', 'persistence', 'prisma');

export default defineConfig({
  schema: _baseDir,
  migrations: {
    path: path.join(_baseDir, 'migrations'),
    seed: path.join(_baseDir, 'seeds/index.ts'),
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
