import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/application/services/prisma.service';
import { UserRepository } from '../../../domain/repositories';
import { UserEntity } from '../../../domain/entities';
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

    const created = await this.prismaService.userDbEntity.create({
      data: {
        email: encryptedEmail,
        emailHash: emailHash,
        userName: user.userName,
        password: user.password!,
        role: user.role,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });

    // We return the entity with the plain email because the Use Case expects it that way
    // (Or we could decrypt it back, but we have it in 'user' arg).
    // Better to map from DB result to be consistent.
    const domainUser = UserMapper.toDomain(created);
    // Restore plain email because it is encrypted in DB
    domainUser.email = this.cryptoService.decrypt(created.email);
    return domainUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const emailHash = this.cryptoService.hash(email);

    const user = await this.prismaService.userDbEntity.findFirst({
      where: { emailHash },
    });

    if (!user) return null;

    const domainUser = UserMapper.toDomain(user);
    domainUser.email = this.cryptoService.decrypt(user.email);
    return domainUser;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaService.userDbEntity.findUnique({
      where: { id },
    });

    if (!user) return null;

    const domainUser = UserMapper.toDomain(user);
    domainUser.email = this.cryptoService.decrypt(user.email);
    return domainUser;
  }

  async findByUserName(userName: string): Promise<UserEntity | null> {
    const user = await this.prismaService.userDbEntity.findUnique({
      where: { userName },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const dataToUpdate = UserMapper.toPersistence(user);

    // Always encrypt and hash email on update to ensure consistency
    // Optimization: In real app, check if email changed.
    if (user.email) {
      dataToUpdate.email = this.cryptoService.encrypt(user.email);
      // We need to force cast to assign the missing property if mapped type doesn't have it
      (dataToUpdate as any).emailHash = this.cryptoService.hash(user.email);
    }

    const updated = await this.prismaService.userDbEntity.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    const domainUser = UserMapper.toDomain(updated);
    domainUser.email = this.cryptoService.decrypt(updated.email);
    return domainUser;
  }
}
