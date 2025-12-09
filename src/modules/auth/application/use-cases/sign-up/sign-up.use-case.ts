import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@modules/auth/domain/repositories';
import { SignUpDto } from '@modules/auth/application/dtos';
import { UserEntity } from '@modules/auth/domain/entities';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: SignUpDto): Promise<UserEntity> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
