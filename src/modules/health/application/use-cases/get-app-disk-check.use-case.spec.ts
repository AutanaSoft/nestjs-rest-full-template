import { Test, TestingModule } from '@nestjs/testing';
import { DiskHealthIndicator } from '@nestjs/terminus';
import { GetAppDiskCheckUseCase } from './get-app-disk-check.use-case';

describe('GetAppDiskCheckUseCase', () => {
  let useCase: GetAppDiskCheckUseCase;

  const mockDiskHealthIndicator = {
    checkStorage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAppDiskCheckUseCase,

        {
          provide: DiskHealthIndicator,
          useValue: mockDiskHealthIndicator,
        },
      ],
    }).compile();

    useCase = module.get<GetAppDiskCheckUseCase>(GetAppDiskCheckUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully check disk storage', async () => {
      // Arrange
      const expectedResult = {
        storage_percent: { status: 'up' },
        storage_size: { status: 'up' },
      };

      mockDiskHealthIndicator.checkStorage.mockImplementation((key) =>
        Promise.resolve({ [key]: { status: 'up' } }),
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(expectedResult);

      // Verify first check (percentage)
      expect(mockDiskHealthIndicator.checkStorage).toHaveBeenCalledWith(
        'storage_percent',
        expect.objectContaining({
          thresholdPercent: 0.5,
          path: '/',
        }),
      );

      // Verify second check (absolute size)
      expect(mockDiskHealthIndicator.checkStorage).toHaveBeenCalledWith(
        'storage_size',
        expect.objectContaining({
          threshold: 107374182400, // 100GB
          path: '/',
        }),
      );
    });
  });
});
