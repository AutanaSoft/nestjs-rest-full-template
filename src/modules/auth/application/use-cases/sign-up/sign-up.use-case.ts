import { SignUpDto } from '@modules/auth/application/dtos';
import { UserEntity } from '@modules/users/domain/entities';
import { UserRepository } from '@modules/users/domain/repositories';
import { ConflictException, Injectable } from '@nestjs/common';
import { HashingService } from '@shared/application/services/hashing.service';

/**
 * Use case to handle user registration (Sign Up).
 *
 * This use case validates uniqueness of email and username, hashes the password,
 * and delegates persistence to the repository.
 */
@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
  ) {}

  /**
   * Executes the sign-up logic.
   *
   * @param dto - The data transfer object containing user registration details.
   * @returns A promise that resolves to the created UserEntity.
   * @throws {ConflictException} If the email or username already exists.
   */
  async execute(dto: SignUpDto): Promise<UserEntity> {
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUser = await this.userRepository.findByUserName(dto.userName);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const newUser = UserEntity.create(dto.email, dto.userName, hashedPassword);

    return await this.userRepository.create(newUser);
  }
}
