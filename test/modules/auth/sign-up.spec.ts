import { SignUpDto } from '@/modules/auth/application/dtos';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { testUserData } from 'test/utils/test.utils';

export const signUpTest = (getApp: () => NestFastifyApplication) => {
  describe('POST /auth/sign-up (e2e)', () => {
    let app: NestFastifyApplication;

    beforeAll(() => {
      app = getApp();
    });

    it('should register a new user', async () => {
      const dto = testUserData;

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', dto.email);
      expect(response.body).toHaveProperty('userName', dto.userName);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('emailHash');
    });

    it('should fail if email already exists', async () => {
      const dto: SignUpDto = {
        email: testUserData.email,
        userName: 'otherUser',
        password: testUserData.password,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'Email already exists');
    });

    it('should fail if username already exists', async () => {
      const dto: SignUpDto = {
        email: 'otherUser@api-test.com',
        userName: testUserData.userName,
        password: testUserData.password,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'Username already exists');
    });
  });
};
