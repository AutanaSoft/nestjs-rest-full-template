import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { AuthenticatedRequest } from '@/shared/application/interfaces/authenticated-request.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
