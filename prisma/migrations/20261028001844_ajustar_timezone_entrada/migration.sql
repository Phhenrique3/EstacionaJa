/*
  Warnings:

  - Made the column `entrada` on table `ParkingSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ParkingSession" ALTER COLUMN "entrada" SET NOT NULL,
ALTER COLUMN "entrada" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "saida" SET DATA TYPE TIMESTAMPTZ(3);
