import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@modules/auth/domain/repositories';
import { VerifyEmailDto } from '@modules/auth/application/dtos';

@Injectable()
export class VerifyEmailUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: VerifyEmailDto): Promise<void> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
