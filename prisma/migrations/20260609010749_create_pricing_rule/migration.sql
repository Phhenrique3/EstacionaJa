/*
  Warnings:

  - You are about to drop the column `tlerancia_minutos` on the `PricingRule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PricingRule" DROP COLUMN "tlerancia_minutos",
ADD COLUMN     "tolerancia_minutos" INTEGER NOT NULL DEFAULT 0;
