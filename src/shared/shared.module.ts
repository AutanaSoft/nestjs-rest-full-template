import { Module } from '@nestjs/common';
import { HashingService } from './application/services';
import { BcryptHashingService, CryptoService } from './infrastructure/services';

@Module({
  controllers: [],
  exports: [CryptoService, HashingService],
  providers: [
    CryptoService,
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
  ],
})
export class SharedModule {}
