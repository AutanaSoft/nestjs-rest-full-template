import { Test, TestingModule } from '@nestjs/testing';
import { SignUpUseCase } from './sign-up.use-case';
import { UserRepository } from '@modules/users/domain/repositories';
import { HashingService } from '@shared/application/services/hashing.service';
import { SignUpDto } from '@modules/auth/application/dtos';
import { UserEntity } from '@modules/users/domain/entities';
import { ConflictException } from '@nestjs/common';

describe('SignUpUseCase', () => {
  let useCase: SignUpUseCase;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findByUserName: jest.fn(),
    create: jest.fn(),
  };

  const mockHashingService = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUseCase,
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

    useCase = module.get<SignUpUseCase>(SignUpUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully sign up a new user', async () => {
    const dto: SignUpDto = {
      email: 'test@example.com',
      userName: 'testuser',
      password: 'password123',
    };

    const hashedPassword = 'hashedPassword';
    const createdUser = UserEntity.restore({
      id: 'uuid',
      email: dto.email,
      userName: dto.userName,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByUserName.mockResolvedValue(null);
    mockHashingService.hash.mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(createdUser);

    const result = await useCase.execute(dto);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUserRepository.findByUserName).toHaveBeenCalledWith(dto.userName);
    expect(mockHashingService.hash).toHaveBeenCalledWith(dto.password);
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(UserEntity));
    expect(result).toEqual(createdUser);
  });

  it('should throw ConflictException if email already exists', async () => {
    const dto: SignUpDto = {
      email: 'existing@example.com',
      userName: 'newuser',
      password: 'password123',
    };

    const existingUser = UserEntity.restore({ email: 'existing@example.com', userName: 'olduser' });

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUserRepository.findByUserName).not.toHaveBeenCalled();
    expect(mockHashingService.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if username already exists', async () => {
    const dto: SignUpDto = {
      email: 'new@example.com',
      userName: 'existinguser',
      password: 'password123',
    };

    const existingUser = UserEntity.restore({ email: 'old@example.com', userName: 'existinguser' });

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.findByUserName.mockResolvedValue(existingUser);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUserRepository.findByUserName).toHaveBeenCalledWith(dto.userName);
    expect(mockHashingService.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
