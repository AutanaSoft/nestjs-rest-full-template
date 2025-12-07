import { registerAs } from '@nestjs/config';

export interface CryptoConfig {
  /**
   * Secret key used as a base for deriving the encryption key.
   *
   * @remarks
   * Must be at least 32 characters long. It is recommended to generate a
   * random 64-character hexadecimal value using the command:
   * `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   */
  readonly secret: string;

  /**
   * Salt used in encryption key derivation using PBKDF2.
   *
   * @remarks
   * Must be at least 16 characters long. It is recommended to generate a
   * random 32-character hexadecimal value using the command:
   * `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
   */
  readonly salt: string;

  /**
   * Encryption algorithm to use.
   *
   * @remarks
   * Default value: 'aes-256-gcm'. This algorithm provides authenticated
   * encryption with built-in data integrity.
   */
  readonly algorithm: string;

  /**
   * Length in bytes of the initialization vector (IV).
   *
   * @remarks
   * Default value: 16 bytes. The IV is a random value that is generated
   * for each encryption operation and ensures that the same plain text
   * produces different ciphertexts.
   */
  readonly ivLength: number;

  /**
   * Length in bytes of the derived encryption key.
   *
   * @remarks
   * Default value: 32 bytes (256 bits). This is the required length
   * for the AES-256 algorithm.
   */
  readonly keyLength: number;
}

/**
 * Factory function to create the cryptography configuration.
 *
 * @returns The validation and loaded configuration object.
 * @throws {Error} If `ENCRYPTION_SECRET` or `ENCRYPTION_SALT` are missing or invalid.
 */
export const cryptoConfigFactory = (): CryptoConfig => {
  const secret = process.env.ENCRYPTION_SECRET;
  const salt = process.env.ENCRYPTION_SALT;

  if (!secret) {
    throw new Error(
      "ENCRYPTION_SECRET is not defined. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }

  if (secret.length < 32) {
    throw new Error('ENCRYPTION_SECRET must be at least 32 characters long');
  }

  if (!salt) {
    throw new Error(
      "ENCRYPTION_SALT is not defined. Generate one with: node -e \"console.log(require('crypto').randomBytes(16).toString('hex'))\"",
    );
  }

  if (salt.length < 16) {
    throw new Error('ENCRYPTION_SALT must be at least 16 characters long');
  }

  return {
    secret,
    salt,
    algorithm: 'aes-256-gcm',
    ivLength: 16,
    keyLength: 32,
  };
};

/**
 * Registers the cryptography configuration under the 'crypto' namespace.
 */
export default registerAs('crypto', (): CryptoConfig => cryptoConfigFactory());
