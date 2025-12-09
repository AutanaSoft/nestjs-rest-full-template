import { Injectable } from '@nestjs/common';
import { UserRepository } from '@modules/users/domain/repositories';
import { ForgotPasswordDto } from '@modules/auth/application/dtos';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
