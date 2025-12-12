import { RoleDbEntity } from '@modules/database/infrastructure/persistence/prisma/generated/client';
import { RoleEntity } from '@modules/users/domain/entities/role.entity';
import { PermissionMapper } from './permission.mapper';
import {
  RolePermissionDbEntity,
  PermissionsDbEntity,
} from '@modules/database/infrastructure/persistence/prisma/generated/client';

type RoleWithPermissions = RoleDbEntity & {
  permissions?: (RolePermissionDbEntity & { permission: PermissionsDbEntity })[];
};

export class RoleMapper {
  static toDomain(entity: RoleWithPermissions): RoleEntity {
    const role = RoleEntity.restore({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description ?? undefined,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    if (entity.permissions) {
      role.permissions = entity.permissions.map((p) => PermissionMapper.toDomain(p.permission));
    }

    return role;
  }

  static toPersistence(domain: RoleEntity): RoleDbEntity {
    return {
      id: domain.id,
      name: domain.name,
      slug: domain.slug,
      description: domain.description ?? null,
      isDefault: domain.isDefault,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    } as RoleDbEntity;
  }
}
