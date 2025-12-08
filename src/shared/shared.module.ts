import { Module } from '@nestjs/common';
import { CryptoService } from './infrastructure/services/crypto.service';

@Module({
  controllers: [],
  exports: [CryptoService],
  providers: [CryptoService],
})
export class SharedModule {}
