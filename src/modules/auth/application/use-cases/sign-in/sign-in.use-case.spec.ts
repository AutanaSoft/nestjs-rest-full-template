import { Test, TestingModule } from '@nestjs/testing';
import { SignInUseCase } from './sign-in.use-case';
import { UserRepository } from '@modules/users/domain/repositories';
import { HashingService } from '@shared/application/services/hashing.service';
import { SignInDto } from '@modules/auth/application/dtos';
import { UserEntity } from '@modules/users/domain/entities';
import { UnauthorizedException } from '@nestjs/common';
import { UserStatus } from '@modules/users/domain/enums';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;

  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  const mockHashingService = {
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: HashingService,
          useValue: mockHashingService,
        },
      ],
    }).compile();

    useCase = module.get<SignInUseCase>(SignInUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully sign in a user', async () => {
    const dto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const user = UserEntity.restore({
      email: dto.email,
      userName: 'username',
      password: 'hashedPassword',
      status: UserStatus.REGISTERED,
    });

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockHashingService.compare.mockResolvedValue(true);

    const result = await useCase.execute(dto);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockHashingService.compare).toHaveBeenCalledWith(dto.password, user.password);
    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    const dto: SignInDto = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockHashingService.compare).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if password does not exist on user', async () => {
    const dto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Simulate user with no password
    const userWithoutPass = UserEntity.restore({
      email: dto.email,
      password: undefined,
    });

    mockUserRepository.findByEmail.mockResolvedValue(userWithoutPass);

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const dto: SignInDto = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const user = UserEntity.restore({
      email: dto.email,
      userName: 'username',
      password: 'hashedPassword',
    });

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockHashingService.compare.mockResolvedValue(false);

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    expect(mockHashingService.compare).toHaveBeenCalledWith(dto.password, user.password);
  });

  it('should throw UnauthorizedException if user is suspended', async () => {
    const dto: SignInDto = {
      email: 'suspended@example.com',
      password: 'password123',
    };

    const user = UserEntity.restore({
      email: dto.email,
      userName: 'username',
      password: 'hashedPassword',
      status: UserStatus.SUSPENDED,
    });

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockHashingService.compare.mockResolvedValue(true);

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user is banned', async () => {
    const dto: SignInDto = {
      email: 'banned@example.com',
      password: 'password123',
    };

    const user = UserEntity.restore({
      email: dto.email,
      userName: 'username',
      password: 'hashedPassword',
      status: UserStatus.BANNED,
    });

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockHashingService.compare.mockResolvedValue(true);

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
  });
});
