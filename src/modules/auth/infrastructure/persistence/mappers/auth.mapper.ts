import {
  UserDbEntity,
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus,
} from '@prisma/client';
import { UserEntity } from '@modules/auth/domain/entities';
import { UserRole, UserStatus } from '@modules/auth/domain/enums';

export class AuthMapper {
  static toDomain(entity: UserDbEntity): UserEntity {
    return new UserEntity({
      id: entity.id,
      email: entity.email,
      emailHash: entity.emailHash,
      userName: entity.userName,
      password: entity.password,
      status: UserStatus[entity.status as keyof typeof UserStatus],
      role: UserRole[entity.role as keyof typeof UserRole],
      emailVerifiedAt: entity.emailVerifiedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: UserEntity): UserDbEntity {
    return {
      id: domain.id,
      email: domain.email,
      emailHash: domain.emailHash,
      userName: domain.userName,
      password: domain.password ?? '',
      status: domain.status as unknown as PrismaUserStatus,
      role: domain.role as unknown as PrismaUserRole,
      emailVerifiedAt: domain.emailVerifiedAt ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    } as UserDbEntity;
  }
}
