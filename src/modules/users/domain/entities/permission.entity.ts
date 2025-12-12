export class PermissionEntity {
  id?: string;
  name?: string;
  slug!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial);
  }

  static create(slug: string, name?: string): PermissionEntity {
    return new PermissionEntity({ slug, name });
  }

  static restore(data: Partial<PermissionEntity>): PermissionEntity {
    return new PermissionEntity(data);
  }
}
