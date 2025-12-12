import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtConfig } from '@/config/jwt.config';
import {
  AccessTokenPayload,
  TempTokenPayload,
} from '../../domain/interfaces/token-payload.interface';
import { TokenService } from '../../domain/services/token.service';

@Injectable()
export class JwtTokenService extends TokenService {
  private readonly authConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.authConfig = this.configService.get<JwtConfig>('auth')!;
  }

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const jwtPayload = {
      sub: payload.sub,
    };

    return this.jwtService.signAsync(jwtPayload, {
      secret: this.authConfig.jwtSecret,
      expiresIn: this.authConfig.jwtExpiresIn,
    });
  }

  async signTemporaryToken(payload: TempTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.authConfig.jwtTempSecret,
      expiresIn: this.authConfig.jwtTempExpiresIn,
    });
  }

  async verifyAccessToken<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.authConfig.jwtSecret,
    });
  }

  async verifyTemporaryToken<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.authConfig.jwtTempSecret,
    });
  }
}
