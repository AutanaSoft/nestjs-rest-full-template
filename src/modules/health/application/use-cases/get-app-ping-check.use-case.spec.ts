import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpHealthIndicator } from '@nestjs/terminus';
import { InternalServerErrorException } from '@nestjs/common';
import { GetAppPingCheckUseCase } from './get-app-ping-check.use-case';

describe('GetAppPingCheckUseCase', () => {
  let useCase: GetAppPingCheckUseCase;

  const mockAppConfig = {
    name: 'test-app',
    server: {
      host: 'localhost',
      port: 3000,
    },
  };

  const mockHttpHealthIndicator = {
    pingCheck: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAppPingCheckUseCase,
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    useCase = module.get<GetAppPingCheckUseCase>(GetAppPingCheckUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return health indicator result when config exists', async () => {
      mockConfigService.get.mockReturnValue(mockAppConfig);
      const expectedResult = {
        'test-app': {
          status: 'up',
        },
      };
      mockHttpHealthIndicator.pingCheck.mockResolvedValue(expectedResult);

      const result = await useCase.execute();

      expect(mockConfigService.get).toHaveBeenCalledWith('appConfig');
      expect(mockHttpHealthIndicator.pingCheck).toHaveBeenCalledWith(
        'test-app',
        'http://localhost:3000/',
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException when config is missing', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(useCase.execute()).rejects.toThrow(InternalServerErrorException);
      expect(mockConfigService.get).toHaveBeenCalledWith('appConfig');
      expect(mockHttpHealthIndicator.pingCheck).not.toHaveBeenCalled();
    });
  });
});
