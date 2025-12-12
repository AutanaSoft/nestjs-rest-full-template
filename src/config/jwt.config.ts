import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

type JwtExpiresInType = NonNullable<JwtModuleOptions['signOptions']>['expiresIn'];

export interface JwtConfig {
  jwtSecret: string;
  jwtTempSecret: string;
  jwtExpiresIn: JwtExpiresInType;
  jwtTempExpiresIn: JwtExpiresInType;
  jwtRefreshExpiresIn: JwtExpiresInType;
}

export const jwtConfigFactory = (): JwtConfig => ({
  jwtSecret: process.env.JWT_SECRET ?? 'super-jwt-secret-key',
  jwtTempSecret: process.env.JWT_TEMP_SECRET ?? 'super-jwt-temp-secret-key',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? '1m') as JwtExpiresInType,
  jwtTempExpiresIn: (process.env.JWT_TEMP_EXPIRES_IN ?? '1m') as JwtExpiresInType,
  jwtRefreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '1m') as JwtExpiresInType,
});

export const createJwtAccessModuleOptions = (config: JwtConfig): JwtModuleOptions => {
  return {
    secret: config.jwtSecret,
    signOptions: {
      expiresIn: config.jwtExpiresIn,
    },
  };
};

export const createJwtTempModuleOptions = (config: JwtConfig): JwtModuleOptions => {
  return {
    secret: config.jwtTempSecret,
    signOptions: {
      expiresIn: config.jwtTempExpiresIn,
    },
  };
};

export default registerAs('jwtConfig', jwtConfigFactory);
