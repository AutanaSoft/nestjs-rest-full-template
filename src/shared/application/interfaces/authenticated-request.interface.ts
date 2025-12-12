import { FastifyRequest } from 'fastify';

import { UserEntity } from '@/modules/users/domain/entities/user.entity';

export interface AuthenticatedRequest extends FastifyRequest {
  user: UserEntity;
}
