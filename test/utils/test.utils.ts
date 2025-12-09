import { SignUpDto } from '@/modules/auth/application/dtos';
import { PrismaService } from '@/modules/database/application/services/prisma.service';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const testUserData: SignUpDto = {
  email: 'test@api-test.com',
  password: 'Password123!',
  userName: 'TestUser',
};

export async function cleanupTestUser(app: NestFastifyApplication): Promise<void> {
  const dataSource = app.get(PrismaService);
  await dataSource.userDbEntity.deleteMany({
    where: {
      userName: {
        contains: testUserData.userName,
      },
    },
  });
}
