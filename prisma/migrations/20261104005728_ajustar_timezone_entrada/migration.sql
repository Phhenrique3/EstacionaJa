/*
  Warnings:

  - You are about to alter the column `valor_total` on the `ParkingSession` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "ParkingSession" ALTER COLUMN "valor_total" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "whatsappNotificadoEm" SET DATA TYPE TIMESTAMPTZ(3);
