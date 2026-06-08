/*
  Warnings:

  - You are about to drop the column `createAt` on the `VehicleCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `VehicleCategory` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `VehicleCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleCategory" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
