import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '@modules/auth/domain/repositories';
import { SignInDto } from '@modules/auth/application/dtos';
import { HashingService } from '@shared/application/services/hashing.service';
import { UserEntity } from '@modules/auth/domain/entities';
import { UserStatus } from '@modules/auth/domain/enums';

/**
 * Use case to handle user sign in.
 *
 * Validates credentials and user status.
 */
@Injectable()
export class SignInUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
  ) {}

  /**
   * Executes the sign-in logic.
   *
   * @param dto - The data transfer object containing login credentials.
   * @returns A promise that resolves to the UserEntity if authentication is successful.
   * @throws {UnauthorizedException} If credentials are invalid or user is blocked.
   */
  async execute(dto: SignInDto): Promise<UserEntity> {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // We check password existence just in case, though it should exist for registered users.
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashingService.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('User is suspended');
    }

    if (user.status === UserStatus.BANNED) {
      throw new UnauthorizedException('User is banned');
    }

    // Return user entity (controller will handle stripping sensitive data via serialization)
    return user;
  }
}
