import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/application/services/prisma.service';
import { AuthRepository } from '@modules/auth/domain/repositories';
import { UserEntity } from '@modules/auth/domain/entities';
import { AuthMapper } from './mappers';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: UserEntity): Promise<UserEntity> {
    await Promise.resolve(user);
    // Usually create takes partial data. Since methods are generic, we assume user entity has data.
    // In real flow, we use Prisma.UserDbEntityCreateInput.
    // For now throwing error as implementation logic comes later or simple create.
    /*
    const created = await this.prismaService.userDbEntity.create({
      data: {
        email: user.email,
        emailHash: user.emailHash,
        userName: user.userName,
        password: user.password!,
        role: user.role,
        status: user.status,
      }
    });
    return AuthMapper.toDomain(created);
    */
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.userDbEntity.findFirst({
      where: { email },
    });
    return user ? AuthMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaService.userDbEntity.findUnique({
      where: { id },
    });
    return user ? AuthMapper.toDomain(user) : null;
  }

  async findByUserName(userName: string): Promise<UserEntity | null> {
    const user = await this.prismaService.userDbEntity.findUnique({
      where: { userName },
    });
    return user ? AuthMapper.toDomain(user) : null;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updated = await this.prismaService.userDbEntity.update({
      where: { id: user.id },
      data: AuthMapper.toPersistence(user),
    });
    return AuthMapper.toDomain(updated);
  }
}
