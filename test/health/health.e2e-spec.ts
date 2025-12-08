import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import {
  GetAppDbCheckUseCase,
  GetAppDiskCheckUseCase,
  GetAppPingCheckUseCase,
} from '../../src/modules/health/application/use-cases';

import { createTestApp } from '../utils/create-test-app';

describe('HealthController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await createTestApp({
      configureBuilder: (builder) => {
        builder.overrideProvider(GetAppPingCheckUseCase).useValue({
          execute: jest.fn().mockResolvedValue({
            app: {
              status: 'up',
            },
          }),
        });
        builder.overrideProvider(GetAppDbCheckUseCase).useValue({
          execute: jest.fn().mockResolvedValue({
            db: {
              status: 'up',
            },
          }),
        });
        builder.overrideProvider(GetAppDiskCheckUseCase).useValue({
          execute: jest.fn().mockResolvedValue({
            storage_percent: {
              status: 'up',
            },
            storage_size: {
              status: 'up',
            },
          }),
        });
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('info');
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('details');
        expect(res.body.status).toBe('ok');
        // Check for specific health indicators
        expect(res.body.info).toHaveProperty('app');
        expect(res.body.info).toHaveProperty('db');
        expect(res.body.info).toHaveProperty('storage_percent');
        expect(res.body.info).toHaveProperty('storage_size');
      });
  });

  it('/health/app (GET)', () => {
    return request(app.getHttpServer())
      .get('/health/app')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('version');
        expect(res.body).toHaveProperty('mode');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('logLevel');
      });
  });
});
