import { JwtConfig } from '@/config/jwt.config';
import {
  TempTokenPayload,
  TokenType,
} from '@modules/auth/domain/interfaces/token-payload.interface';
import { UserEntity } from '@modules/users/domain/entities';
import { UserRepository } from '@modules/users/domain/repositories';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtTempStrategy extends PassportStrategy(Strategy, 'jwt-temp') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>('jwtConfig')?.jwtTempSecret ?? '',
    });
  }

  async validate(payload: TempTokenPayload): Promise<UserEntity> {
    if (payload.type !== TokenType.FORGOT_PASSWORD && payload.type !== TokenType.VERIFY_EMAIL) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Note: We might allow suspended/banned users to verify email or reset password depending on business logic.
    // limiting scope for now to just finding the user.

    return user;
  }
}
