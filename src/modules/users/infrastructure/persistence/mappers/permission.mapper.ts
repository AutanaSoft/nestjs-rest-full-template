import { PermissionsDbEntity } from '@modules/database/infrastructure/persistence/prisma/generated/client';
import { PermissionEntity } from '@modules/users/domain/entities/permission.entity';

export class PermissionMapper {
  static toDomain(entity: PermissionsDbEntity): PermissionEntity {
    return PermissionEntity.restore({
      id: entity.id,
      name: entity.name ?? undefined,
      slug: entity.slug,
      description: entity.description ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: PermissionEntity): PermissionsDbEntity {
    return {
      id: domain.id,
      name: domain.name ?? null,
      slug: domain.slug,
      description: domain.description ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    } as PermissionsDbEntity;
  }
}
