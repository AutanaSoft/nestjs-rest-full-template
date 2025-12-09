import { databaseConfigFactory } from '@config/database.config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaClient } from '@modules/database/infrastructure/persistence/prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@InjectPinoLogger(PrismaService.name) private readonly logger: PinoLogger) {
    const { connectionString } = databaseConfigFactory();
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.info('Database connection established successfully');
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to connect to database');
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.info('Database connection closed successfully');
    } catch (error: unknown) {
      this.logger.error({ error }, 'Failed to disconnect from database');
      throw error;
    }
  }
}
