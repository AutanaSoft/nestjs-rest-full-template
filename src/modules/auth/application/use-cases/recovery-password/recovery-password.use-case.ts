import { Injectable } from '@nestjs/common';
import { UserRepository } from '@modules/users/domain/repositories';
import { RecoveryPasswordDto } from '@modules/auth/application/dtos';

@Injectable()
export class RecoveryPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: RecoveryPasswordDto): Promise<void> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
