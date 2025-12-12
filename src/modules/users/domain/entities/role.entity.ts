import { PermissionEntity } from './permission.entity';

export class RoleEntity {
  id?: string;
  name!: string;
  slug!: string;
  description?: string;
  isDefault = false;
  permissions: PermissionEntity[] = [];
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }

  static create(name: string, slug: string, isDefault = false): RoleEntity {
    return new RoleEntity({ name, slug, isDefault });
  }

  static restore(data: Partial<RoleEntity>): RoleEntity {
    return new RoleEntity(data);
  }
}
