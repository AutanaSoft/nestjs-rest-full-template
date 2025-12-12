import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserEntity } from '@modules/users/domain/entities';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }
    return user as UserEntity;
  }
}
