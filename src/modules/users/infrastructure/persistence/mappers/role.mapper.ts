import { RoleDbEntity } from '@modules/database/infrastructure/persistence/prisma/generated/client';
import { RoleEntity } from '@modules/users/domain/entities/role.entity';

export class RoleMapper {
  static toDomain(entity: RoleDbEntity): RoleEntity {
    return RoleEntity.restore({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description ?? undefined,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
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
