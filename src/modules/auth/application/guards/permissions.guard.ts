import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { UserEntity } from '@modules/users/domain/entities';
import { AuthenticatedRequest } from '@/shared/application/interfaces/authenticated-request.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!user || !(user instanceof UserEntity)) {
      return false;
    }

    const userPermissions = this.getUserPermissions(user);

    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }

  private getUserPermissions(user: UserEntity): string[] {
    const permissions = new Set<string>();

    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.add(permission.slug);
      });
    });

    return Array.from(permissions);
  }
}
