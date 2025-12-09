import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { cleanupTestUser } from 'test/utils/test.utils';
import { signUpTest } from './sign-up.spec';
import { signInTest } from './sign-in.spec';

export const authControllerTest = (getApp: () => NestFastifyApplication) => {
  describe('AuthController (e2e)', () => {
    let app: NestFastifyApplication;

    beforeAll(async () => {
      app = getApp();
      await cleanupTestUser(app);
    });

    afterAll(async () => {
      await cleanupTestUser(app);
    });

    signUpTest(() => app);
    signInTest(() => app);
  });
};
