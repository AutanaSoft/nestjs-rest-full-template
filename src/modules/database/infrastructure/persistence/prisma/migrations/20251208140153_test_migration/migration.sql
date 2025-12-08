-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MODERATOR', 'SUPPORT', 'USER', 'GUEST');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('REGISTERED', 'ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "email_hash" VARCHAR(64) NOT NULL,
    "user_name" VARCHAR(20) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'REGISTERED',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "email_verified_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_hash_key" ON "users"("email_hash");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE INDEX "users_email_hash_idx" ON "users"("email_hash");

-- CreateIndex
CREATE INDEX "users_user_name_idx" ON "users"("user_name");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
