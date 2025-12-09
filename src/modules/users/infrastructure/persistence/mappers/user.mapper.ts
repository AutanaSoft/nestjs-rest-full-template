import {
  UserDbEntity,
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus,
} from '@prisma/client';
import { UserEntity } from '@modules/users/domain/entities';
import { UserRole, UserStatus } from '@modules/users/domain/enums';

/**
 * Mapper for transforming between User Domain Entities and Database Entities.
 *
 * Handles the conversion of data structures to ensure the domain is decoupled from persistence details.
 */
export class UserMapper {
  /**
   * Converts a database entity to a domain entity.
   *
   * @param entity - The Prisma UserDbEntity.
   * @returns The corresponding UserEntity.
   */
  static toDomain(entity: UserDbEntity): UserEntity {
    return UserEntity.restore({
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      password: entity.password,
      status: UserStatus[entity.status as keyof typeof UserStatus],
      role: UserRole[entity.role as keyof typeof UserRole],
      emailVerifiedAt: entity.emailVerifiedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Converts a domain entity to a persistence entity (Prisma).
   *
   * @param domain - The UserEntity to convert.
   * @returns The corresponding UserDbEntity (or partial structure).
   */
  static toPersistence(domain: UserEntity): UserDbEntity {
    return {
      id: domain.id,
      email: domain.email,
      userName: domain.userName,
      password: domain.password ?? '',
      status: domain.status as unknown as PrismaUserStatus,
      role: domain.role as unknown as PrismaUserRole,
      emailVerifiedAt: domain.emailVerifiedAt ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    } as unknown as UserDbEntity;
  }
}
