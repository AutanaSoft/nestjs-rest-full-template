import { PrismaService } from '@modules/database/application/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaHealthIndicator } from '@nestjs/terminus';
import { GetAppDbCheckUseCase } from './get-app-db-check.use-case';

describe('GetAppDbCheckUseCase', () => {
  let useCase: GetAppDbCheckUseCase;

  const mockPrismaHealthIndicator = {
    pingCheck: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAppDbCheckUseCase,
        {
          provide: PrismaHealthIndicator,
          useValue: mockPrismaHealthIndicator,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    useCase = module.get<GetAppDbCheckUseCase>(GetAppDbCheckUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully check database health', async () => {
      // Arrange
      const expectedResult = {
        db: { status: 'up' },
      };

      mockPrismaHealthIndicator.pingCheck.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrismaHealthIndicator.pingCheck).toHaveBeenCalledWith('db', mockPrismaService);
    });
  });
});
