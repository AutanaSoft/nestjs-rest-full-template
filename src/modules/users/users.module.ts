import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database/database.module';
import { SharedModule } from '@shared/shared.module';
import { UserRepository } from './domain/repositories/user.repository';
import { UserPrismaRepository } from './infrastructure/persistence/repositories/user.prisma.repository';

@Module({
  imports: [DatabaseModule, SharedModule],
  controllers: [],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
