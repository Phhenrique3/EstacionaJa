/*
  Warnings:

  - You are about to drop the column `rele` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "rele",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'OPERATOR';
