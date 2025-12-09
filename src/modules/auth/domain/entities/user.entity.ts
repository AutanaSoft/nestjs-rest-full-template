import { UserRole, UserStatus } from '../enums';

export class UserEntity {
  id: string;
  email: string;
  emailHash: string;
  userName: string;
  password?: string;
  status: UserStatus;
  role: UserRole;
  emailVerifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
