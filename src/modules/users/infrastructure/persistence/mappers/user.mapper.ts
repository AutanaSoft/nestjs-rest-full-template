import {
  UserDbEntity,
  UserStatus as PrismaUserStatus,
  UserRoleDbEntity,
  RoleDbEntity,
} from '@modules/database/infrastructure/persistence/prisma/generated/client';
import { UserEntity } from '@modules/users/domain/entities';
import { UserStatus } from '@modules/users/domain/enums';
import { RoleMapper } from './role.mapper';

type UserWithRoles = UserDbEntity & {
  roles?: (UserRoleDbEntity & { role: RoleDbEntity })[];
};

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
  static toDomain(entity: UserWithRoles): UserEntity {
    const domainUser = UserEntity.restore({
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      password: entity.password,
      status: UserStatus[entity.status as keyof typeof UserStatus],
      emailVerifiedAt: entity.emailVerifiedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    if (entity.roles) {
      domainUser.roles = entity.roles.map((userRole) => RoleMapper.toDomain(userRole.role));
    }

    return domainUser;
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
      emailVerifiedAt: domain.emailVerifiedAt ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    } as unknown as UserDbEntity;
  }
}
