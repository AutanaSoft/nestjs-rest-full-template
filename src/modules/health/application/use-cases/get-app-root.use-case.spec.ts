import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GetAppRootUseCase } from './get-app-root.use-case';
import { AppStatusEnum } from '../enums';

describe('GetAppRootUseCase', () => {
  let useCase: GetAppRootUseCase;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAppRootUseCase,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    useCase = module.get<GetAppRootUseCase>(GetAppRootUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return UP status when config exists', () => {
      mockConfigService.get.mockReturnValue({});

      const result = useCase.execute();

      expect(mockConfigService.get).toHaveBeenCalledWith('appConfig');
      expect(result.status).toBe(AppStatusEnum.UP);
    });

    it('should return DOWN status when config is missing', () => {
      mockConfigService.get.mockReturnValue(undefined);

      const result = useCase.execute();

      expect(mockConfigService.get).toHaveBeenCalledWith('appConfig');
      expect(result.status).toBe(AppStatusEnum.DOWN);
    });
  });
});
