import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

/**
 * Use case to perform a health check on the server's disk storage.
 *
 * @remarks
 * Uses the DiskHealthIndicator to verify that:
 * 1. Used storage does not exceed 80%.
 * 2. Used storage does not exceed 100GB.
 */
@Injectable()
export class GetAppDiskCheckUseCase {
  /**
   * Initializes the use case with required services.
   *
   * @param disk - NestJS DiskHealthIndicator for checking disk storage.
   */
  constructor(private readonly disk: DiskHealthIndicator) {}

  /**
   * Executes the disk health check.
   *
   * @returns A Promise that resolves to the health indicator result.
   */
  async execute(): Promise<HealthIndicatorResult> {
    const percentResult = await this.disk.checkStorage('storage_percent', {
      thresholdPercent: 0.8,
      path: '/',
    });

    const sizeResult = await this.disk.checkStorage('storage_size', {
      threshold: 100 * 1024 * 1024 * 1024, // 100GB in bytes
      path: '/',
    });

    return { ...percentResult, ...sizeResult };
  }
}
