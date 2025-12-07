/**
 * Pruebas unitarias para AppStatusUseCase.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppStatusUseCase } from './app-status.use-case';
import { InternalServerErrorException } from '@nestjs/common';
import { AppConfig } from '@config/app.config';

describe('AppStatusUseCase', () => {
  let useCase: AppStatusUseCase;
  let configService: ConfigService;

  const mockAppConfig: AppConfig = {
    name: 'TestApp',
    description: 'Test Description',
    version: '1.0.0',
    mode: 'test',
    logLevel: 'info',
    appPrefixEnabled: true,
    appPrefix: 'v1',
    server: {
      host: 'localhost',
      port: 3000,
    },
    swagger: {
      enabled: false,
      path: 'docs',
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    // Set default behavior for module compilation
    mockConfigService.get.mockReturnValue(mockAppConfig);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppStatusUseCase,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    // Note: We don't reset the mock here because we want to keep the default behavior,
    // or we manage it per test.
  });

  it('should be defined', () => {
    mockConfigService.get.mockReturnValue(mockAppConfig);
    const module = new AppStatusUseCase(configService);
    expect(module).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw InternalServerErrorException if appConfig is not found', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(() => new AppStatusUseCase(configService)).toThrow(InternalServerErrorException);
    });

    it('should initialize correctly when appConfig is found', () => {
      mockConfigService.get.mockReturnValue(mockAppConfig);

      const instance = new AppStatusUseCase(configService);
      expect(instance).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should return the app status dto', () => {
      mockConfigService.get.mockReturnValue(mockAppConfig);
      useCase = new AppStatusUseCase(configService);

      const result = useCase.execute();

      expect(result).toEqual({
        name: mockAppConfig.name,
        description: mockAppConfig.description,
        version: mockAppConfig.version,
        mode: mockAppConfig.mode,
        logLevel: mockAppConfig.logLevel,
      });
    });
  });
});
