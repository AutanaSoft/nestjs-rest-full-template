import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { GetAppStatusUseCase } from './get-app-status.use-case';

describe('GetAppStatusUseCase', () => {
  let useCase: GetAppStatusUseCase;

  const mockAppConfig = {
    name: 'test-app',
    version: '1.0.0',
    description: 'Test Description',
    mode: 'test',
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const createModule = async () => {
    return Test.createTestingModule({
      providers: [
        GetAppStatusUseCase,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined when config exists', async () => {
      mockConfigService.get.mockReturnValue(mockAppConfig);
      const module = await createModule();
      useCase = module.get<GetAppStatusUseCase>(GetAppStatusUseCase);
      expect(useCase).toBeDefined();
    });

    it('should throw InternalServerErrorException when config is missing', async () => {
      mockConfigService.get.mockReturnValue(undefined);
      await expect(createModule()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('execute', () => {
    beforeEach(async () => {
      mockConfigService.get.mockReturnValue(mockAppConfig);
      const module = await createModule();
      useCase = module.get<GetAppStatusUseCase>(GetAppStatusUseCase);
    });

    it('should return app status dto', () => {
      const result = useCase.execute();

      expect(result).toBeDefined();
      expect(result.name).toBe(mockAppConfig.name);
      expect(result.version).toBe(mockAppConfig.version);
      expect(result.description).toBe(mockAppConfig.description);
      expect(result.mode).toBe(mockAppConfig.mode);
    });
  });
});
