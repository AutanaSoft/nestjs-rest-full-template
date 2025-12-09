import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@modules/auth/domain/repositories';
import { SignInDto } from '@modules/auth/application/dtos';

@Injectable()
export class SignInUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: SignInDto): Promise<void> {
    await Promise.resolve(dto);
    throw new Error('Method not implemented.');
  }
}
