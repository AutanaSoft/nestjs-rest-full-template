import cryptoConfig from '@config/crypto.config';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { decryptWithKey, deriveKey, encryptWithKey, hash } from '@shared/infrastructure/utils';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * Cryptography service for encryption, decryption, and hashing operations.
 *
 * Provides secure methods to protect sensitive data using AES-256-GCM encryption
 * and SHA-256 hashing. It uses key derivation with scrypt to enhance security.
 * The service derives the encryption key once during initialization to optimize performance.
 *
 * @public
 */
@Injectable()
export class CryptoService {
  private readonly derivedKey: Buffer;

  constructor(
    @Inject(cryptoConfig.KEY)
    private readonly config: ConfigType<typeof cryptoConfig>,
    @InjectPinoLogger(CryptoService.name)
    private readonly logger: PinoLogger,
  ) {
    this.derivedKey = deriveKey(this.config.secret, this.config.salt, this.config.keyLength);
    this.logger.info('CryptoService initialized with derived encryption key');
  }

  /**
   * Encrypts a string using the derived key.
   *
   * @param text - The plain text string to encrypt.
   * @returns The encrypted string.
   * @throws {InternalServerErrorException} If the encryption process fails.
   */
  encrypt(text: string): string {
    this.logger.debug({ method: 'encrypt' });

    try {
      const encrypted = encryptWithKey(
        text,
        this.derivedKey,
        this.config.algorithm,
        this.config.ivLength,
      );

      this.logger.debug('Data encrypted successfully');
      return encrypted;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Encryption failed: ${errorMessage}`);
    }
  }

  /**
   * Decrypts an encrypted string using the derived key.
   *
   * @param encryptedData - The encrypted string to decrypt.
   * @returns The decrypted plain text string.
   * @throws {InternalServerErrorException} If the decryption process fails.
   */
  decrypt(encryptedData: string): string {
    this.logger.debug({ method: 'decrypt' });

    try {
      const decrypted = decryptWithKey(encryptedData, this.derivedKey, this.config.algorithm);

      this.logger.debug('Data decrypted successfully');
      return decrypted;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Decryption failed: ${errorMessage}`);
    }
  }

  /**
   * Generates a SHA-256 hash of the input text.
   *
   * @param text - The text to hash.
   * @returns The hexadecimal representation of the hash.
   * @throws {Error} If the hashing operation fails.
   */
  hash(text: string): string {
    this.logger.debug({ method: 'hash' });

    try {
      const hashed = hash(text);
      this.logger.debug('Data hashed successfully');
      return hashed;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error({ error: errorMessage, method: 'hash' }, 'Hashing failed');
      throw new Error(`Hashing operation failed: ${errorMessage}`);
    }
  }
}
