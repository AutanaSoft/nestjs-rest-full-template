import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/application/services/prisma.service';
import { UserRepository } from '@modules/users/domain/repositories';
import { UserEntity } from '@modules/users/domain/entities';
import { CryptoService } from '@shared/infrastructure/services/crypto.service';
import { UserMapper } from '../mappers';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const encryptedEmail = this.cryptoService.encrypt(user.email);
    const emailHash = this.cryptoService.hash(user.email);

    // Find default role (usually 'user')
    // TODO: This should be cached or configured
    const defaultRole = await this.prismaService.roleDbEntity.findUnique({
      where: { slug: 'user' },
    });

    const created = await this.prismaService.userDbEntity.create({
      data: {
        email: encryptedEmail,
        emailHash: emailHash,
        userName: user.userName,
        password: user.password!,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt,
        roles: defaultRole
          ? {
              create: {
                roleId: defaultRole.id,
              },
            }
          : undefined,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const domainUser = UserMapper.toDomain(created);
    domainUser.email = this.cryptoService.decrypt(created.email);
    return domainUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const emailHash = this.cryptoService.hash(email);

    const user = await this.prismaService.userDbEntity.findFirst({
      where: { emailHash },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    const domainUser = UserMapper.toDomain(user);
    domainUser.email = this.cryptoService.decrypt(user.email);
    return domainUser;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaService.userDbEntity.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    const domainUser = UserMapper.toDomain(user);
    domainUser.email = this.cryptoService.decrypt(user.email);
    return domainUser;
  }

  async findByUserName(userName: string): Promise<UserEntity | null> {
    const user = await this.prismaService.userDbEntity.findUnique({
      where: { userName },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const dataToUpdate = UserMapper.toPersistence(user);

    // Always encrypt and hash email on update to ensure consistency
    if (user.email) {
      dataToUpdate.email = this.cryptoService.encrypt(user.email);
      (dataToUpdate as any).emailHash = this.cryptoService.hash(user.email);
    }

    const updated = await this.prismaService.userDbEntity.update({
      where: { id: user.id },
      data: dataToUpdate,
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const domainUser = UserMapper.toDomain(updated);
    domainUser.email = this.cryptoService.decrypt(updated.email);
    return domainUser;
  }
}
