import { PrismaService } from '@modules/database/application/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, PrismaHealthIndicator } from '@nestjs/terminus';

/**
 * Use case to perform a health check on the database connection.
 *
 * @remarks
 * Uses the PrismaHealthIndicator to ping the database and verify connectivity.
 */
@Injectable()
export class GetAppDbCheckUseCase {
  /**
   * Initializes the use case with required services.
   *
   * @param prismaHealth - NestJS PrismaHealthIndicator for checking Prisma database connection.
   * @param prisma - PrismaService instance to check.
   */
  constructor(
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  /**
   * Executes the database health check.
   *
   * @returns A Promise that resolves to the health check result.
   */
  async execute(): Promise<HealthIndicatorResult<'db'>> {
    return this.prismaHealth.pingCheck('db', this.prisma);
  }
}
