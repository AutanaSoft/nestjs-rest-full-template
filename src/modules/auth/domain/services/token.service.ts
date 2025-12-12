import {
  AccessTokenPayload,
  TempTokenPayload,
} from '@modules/auth/domain/interfaces/token-payload.interface';

export abstract class TokenService {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;
  abstract signTemporaryToken(payload: TempTokenPayload): Promise<string>;
  abstract verifyAccessToken<T extends object>(token: string): Promise<T>;
  abstract verifyTemporaryToken<T extends object>(token: string): Promise<T>;
}
