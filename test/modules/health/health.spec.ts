import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

export const healthControllerTest = (getApp: () => NestFastifyApplication) => {
  describe('HealthController (e2e)', () => {
    let app: NestFastifyApplication;

    beforeAll(() => {
      app = getApp();
    });

    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const body: {
            status: string;
            info: Record<string, unknown>;
            error: unknown;
            details: unknown;
          } = res.body;

          expect(body).toHaveProperty('status');
          expect(body).toHaveProperty('info');
          expect(body).toHaveProperty('error');
          expect(body).toHaveProperty('details');
          expect(body.status).toBe('ok');
          // Check for specific health indicators
          expect(body.info).toHaveProperty('app');
          expect(body.info).toHaveProperty('db');
          expect(body.info).toHaveProperty('storage_percent');
          expect(body.info).toHaveProperty('storage_size');
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
};
