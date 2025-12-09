import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@modules/auth/domain/repositories';
import { ForgotPasswordDto } from '@modules/auth/application/dtos';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
