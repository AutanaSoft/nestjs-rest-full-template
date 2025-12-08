import cryptoConfig from '@config/crypto.config';
import { InternalServerErrorException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as cryptoUtils from '@shared/infrastructure/utils';
import { getLoggerToken } from 'nestjs-pino';
import { CryptoService } from './crypto.service';

jest.mock('@shared/infrastructure/utils');

describe('CryptoService', () => {
  let service: CryptoService;

  const mockConfig: ConfigType<typeof cryptoConfig> = {
    secret: 'test-secret-key-must-be-very-long',
    salt: 'test-salt',
    keyLength: 32,
    algorithm: 'aes-256-gcm',
    ivLength: 16,
  };

  const mockLogger = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  const mockDerivedKey = Buffer.from('derived-key');

  beforeEach(async () => {
    jest.clearAllMocks();

    (cryptoUtils.deriveKey as jest.Mock).mockReturnValue(mockDerivedKey);
    (cryptoUtils.encryptWithKey as jest.Mock).mockReturnValue('encrypted-text');
    (cryptoUtils.decryptWithKey as jest.Mock).mockReturnValue('plain-text');
    (cryptoUtils.hash as jest.Mock).mockReturnValue('hashed-text');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: cryptoConfig.KEY,
          useValue: mockConfig,
        },
        {
          provide: getLoggerToken(CryptoService.name),
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cryptoUtils.deriveKey).toHaveBeenCalledWith(
      mockConfig.secret,
      mockConfig.salt,
      mockConfig.keyLength,
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      'CryptoService initialized with derived encryption key',
    );
  });

  describe('encrypt', () => {
    it('should encrypt text successfully', () => {
      const text = 'hello world';
      const result = service.encrypt(text);

      expect(result).toBe('encrypted-text');
      expect(cryptoUtils.encryptWithKey).toHaveBeenCalledWith(
        text,
        mockDerivedKey,
        mockConfig.algorithm,
        mockConfig.ivLength,
      );
      expect(mockLogger.debug).toHaveBeenCalledWith({ method: 'encrypt' });
      expect(mockLogger.debug).toHaveBeenCalledWith('Data encrypted successfully');
    });

    it('should throw InternalServerErrorException on encryption failure', () => {
      (cryptoUtils.encryptWithKey as jest.Mock).mockImplementation(() => {
        throw new Error('Encryption error');
      });

      expect(() => service.encrypt('text')).toThrow(InternalServerErrorException);
      expect(() => service.encrypt('text')).toThrow('Encryption failed: Encryption error');
    });
  });

  describe('decrypt', () => {
    it('should decrypt text successfully', () => {
      const encryptedText = 'encrypted-text';
      const result = service.decrypt(encryptedText);

      expect(result).toBe('plain-text');
      expect(cryptoUtils.decryptWithKey).toHaveBeenCalledWith(
        encryptedText,
        mockDerivedKey,
        mockConfig.algorithm,
      );
      expect(mockLogger.debug).toHaveBeenCalledWith({ method: 'decrypt' });
      expect(mockLogger.debug).toHaveBeenCalledWith('Data decrypted successfully');
    });

    it('should throw InternalServerErrorException on decryption failure', () => {
      (cryptoUtils.decryptWithKey as jest.Mock).mockImplementation(() => {
        throw new Error('Decryption error');
      });

      expect(() => service.decrypt('text')).toThrow(InternalServerErrorException);
      expect(() => service.decrypt('text')).toThrow('Decryption failed: Decryption error');
    });
  });

  describe('hash', () => {
    it('should hash text successfully', () => {
      const text = 'text-to-hash';
      const result = service.hash(text);

      expect(result).toBe('hashed-text');
      expect(cryptoUtils.hash).toHaveBeenCalledWith(text);
      expect(mockLogger.debug).toHaveBeenCalledWith({ method: 'hash' });
      expect(mockLogger.debug).toHaveBeenCalledWith('Data hashed successfully');
    });

    it('should throw Error on hashing failure', () => {
      (cryptoUtils.hash as jest.Mock).mockImplementation(() => {
        throw new Error('Hashing error');
      });

      expect(() => service.hash('text')).toThrow(Error);
      expect(() => service.hash('text')).toThrow('Hashing operation failed: Hashing error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        { error: 'Hashing error', method: 'hash' },
        'Hashing failed',
      );
    });
  });
});
