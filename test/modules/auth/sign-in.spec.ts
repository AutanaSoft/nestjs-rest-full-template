import { SignInDto } from '@/modules/auth/application/dtos';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { testUserData } from 'test/utils/test.utils';

export const signInTest = (getApp: () => NestFastifyApplication) => {
  describe('POST /auth/sign-in (e2e)', () => {
    let app: NestFastifyApplication;

    beforeAll(() => {
      app = getApp();
    });

    it('should login successfully with valid credentials', async () => {
      const dto: SignInDto = {
        email: testUserData.email,
        password: testUserData.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(dto)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', dto.email);
      expect(response.body).toHaveProperty('userName', testUserData.userName);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should login successfully with un-trimmed/mixed-case email', async () => {
      const dto: SignInDto = {
        email: `  ${testUserData.email.toUpperCase()}  `,
        password: testUserData.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(dto)
        .expect(200);

      expect(response.body).toHaveProperty('email', testUserData.email);
    });

    it('should fail with generic message if password is incorrect', async () => {
      const dto: SignInDto = {
        email: testUserData.email,
        password: 'WrongPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(dto)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail with generic message if user does not exist', async () => {
      const dto: SignInDto = {
        email: 'nonexistent@api-test.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(dto)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail if email format is invalid', async () => {
      const dto = { email: 'not-an-email', password: 'Password123!' };
      await request(app.getHttpServer()).post('/auth/sign-in').send(dto).expect(400);
    });

    it('should fail if required fields are missing', async () => {
      const dto = { email: testUserData.email };
      await request(app.getHttpServer()).post('/auth/sign-in').send(dto).expect(400);
    });

    it('should fail if request contains non-whitelisted properties', async () => {
      const dto = { ...testUserData, isAdmin: true };
      await request(app.getHttpServer()).post('/auth/sign-in').send(dto).expect(400);
    });
  });
};
