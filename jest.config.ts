import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import * as fs from 'fs';

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf8'));
const compilerOptions = tsconfig.compilerOptions;

const baseProject: Config = {
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest', { configFile: '.swcrc' }],
  },
  testEnvironment: 'node',
  cacheDirectory: '.tmp/jestCache',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '!<rootDir>/src/config/**/*.(t|j)s',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/modules/database/**/*.(t|j)s',
    '!<rootDir>/src/**/index.(t|j)s',
  ],
  clearMocks: true,
  modulePaths: ['./'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths as Record<string, string[]>, {
    prefix: '<rootDir>/',
  }),
};

const config: Config = {
  projects: [
    {
      ...baseProject,
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.spec.ts'],
    },
    {
      ...baseProject,
      displayName: 'e2e',
      testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
    },
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

export default config;
