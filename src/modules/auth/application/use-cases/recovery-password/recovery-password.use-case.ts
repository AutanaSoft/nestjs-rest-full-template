import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@modules/auth/domain/repositories';
import { RecoveryPasswordDto } from '@modules/auth/application/dtos';

@Injectable()
export class RecoveryPasswordUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: RecoveryPasswordDto): Promise<void> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
