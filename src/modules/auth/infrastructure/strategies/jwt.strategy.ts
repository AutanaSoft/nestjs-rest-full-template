import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserEntity } from '@modules/users/domain/entities';
import { UserStatus } from '@modules/users/domain/enums';
import { UserRepository } from '@modules/users/domain/repositories';

import { JwtConfig } from '@/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>('jwtConfig')?.jwtSecret ?? '',
    });
  }

  async validate(payload: { sub: string }): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.REGISTERED) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }
}
