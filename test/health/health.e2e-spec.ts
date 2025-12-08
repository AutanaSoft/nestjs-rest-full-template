import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { GetAppPingCheckUseCase } from '../../src/modules/health/application/use-cases/get-app-ping-check.use-case';

import { createTestApp } from '../utils/create-test-app';

describe('HealthController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await createTestApp({
      configureBuilder: (builder) => {
        builder.overrideProvider(GetAppPingCheckUseCase).useValue({
          execute: jest.fn().mockResolvedValue({
            'NestJS Rest Full Template': {
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
