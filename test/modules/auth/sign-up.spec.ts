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
      const dto = { ...testUserData };

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
      const dto: SignUpDto = { ...testUserData, userName: 'otherUser' };
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'Email already exists');
    });

    it('should fail if username already exists', async () => {
      const dto: SignUpDto = { ...testUserData, email: 'otherUser@api-test.com' };
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'Username already exists');
    });
    it('should register a new user with valid username (dots/underscores) and password (uppercase/specials)', async () => {
      const dto: SignUpDto = {
        ...testUserData,
        email: 'complex.user@api-test.com',
        userName: `${testUserData.userName}_1`,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('userName', dto.userName);
    });

    it('should transform email to lowercase', async () => {
      const dto: SignUpDto = {
        ...testUserData,
        email: 'UPPEREMAIL@api-test.com',
        userName: `${testUserData.userName}_Upper`,
      };
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('email', dto.email.toLowerCase());
    });

    it('should fail if email format is invalid', async () => {
      const dto = { ...testUserData, email: 'invalid-email' };
      await request(app.getHttpServer()).post('/auth/sign-up').send(dto).expect(400);
    });

    it('should fail if username is too short', async () => {
      const dto = { ...testUserData, userName: 'ab' };
      await request(app.getHttpServer()).post('/auth/sign-up').send(dto).expect(400);
    });

    it('should fail if username contains forbidden characters', async () => {
      const dto = { ...testUserData, userName: 'user%' };
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(400);

      const body = response.body as { message: string | string[] };
      expect(JSON.stringify(body.message)).toContain(
        'Username must contain only letters, numbers, dots and underscores',
      );
    });

    it('should fail if password is too short', async () => {
      const dto = { ...testUserData, password: '123' };
      await request(app.getHttpServer()).post('/auth/sign-up').send(dto).expect(400);
    });

    it('should fail if password does not contain uppercase', async () => {
      const dto = { ...testUserData, password: 'password123!' };
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(dto)
        .expect(400);

      const body = response.body as { message: string | string[] };
      expect(JSON.stringify(body.message)).toContain(
        'Password must contain at least one uppercase letter and one special character',
      );
    });

    it('should fail if password does not contain special characters', async () => {
      const dto = { ...testUserData, password: 'Password123' };
      await request(app.getHttpServer()).post('/auth/sign-up').send(dto).expect(400);
    });

    it('should fail if request contains non-whitelisted properties', async () => {
      const dto = { ...testUserData, isAdmin: true };
      await request(app.getHttpServer()).post('/auth/sign-up').send(dto).expect(400);
    });

    it('should fail if required fields are missing', async () => {
      const dto = { email: 'onlyemail@test.com' };
      await request(app.getHttpServer()).post('/auth/sign-up').send(dto).expect(400);
    });
  });
};
