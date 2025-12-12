import { UserEntity } from '@modules/users/domain/entities';

export enum TokenType {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export interface AccessTokenPayload {
  sub: string;
  user: UserEntity;
  iat?: number;
  exp?: number;
}

export interface TempTokenPayload {
  sub: string;
  type: TokenType;
  iat?: number;
  exp?: number;
}
