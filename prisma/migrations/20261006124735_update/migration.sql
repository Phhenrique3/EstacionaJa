/*
  Warnings:

  - The values [MINUTOS] on the enum `TipoCobranca` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoCobranca_new" AS ENUM ('HORA', 'DIARIA', 'MENSAL', 'MINUTO');
ALTER TABLE "public"."ParkingSession" ALTER COLUMN "tipo_cobranca" DROP DEFAULT;
ALTER TABLE "PricingRule" ALTER COLUMN "tipo_cobranca" TYPE "TipoCobranca_new" USING ("tipo_cobranca"::text::"TipoCobranca_new");
ALTER TABLE "ParkingSession" ALTER COLUMN "tipo_cobranca" TYPE "TipoCobranca_new" USING ("tipo_cobranca"::text::"TipoCobranca_new");
ALTER TYPE "TipoCobranca" RENAME TO "TipoCobranca_old";
ALTER TYPE "TipoCobranca_new" RENAME TO "TipoCobranca";
DROP TYPE "public"."TipoCobranca_old";
ALTER TABLE "ParkingSession" ALTER COLUMN "tipo_cobranca" SET DEFAULT 'HORA';
COMMIT;
