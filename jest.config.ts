import type { Config } from 'jest';

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
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
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
