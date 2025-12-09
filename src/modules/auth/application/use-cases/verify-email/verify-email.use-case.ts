import { Injectable } from '@nestjs/common';
import { UserRepository } from '@modules/users/domain/repositories';
import { VerifyEmailDto } from '@modules/auth/application/dtos';

@Injectable()
export class VerifyEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: VerifyEmailDto): Promise<void> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
