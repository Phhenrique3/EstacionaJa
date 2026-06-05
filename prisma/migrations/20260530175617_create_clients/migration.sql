/*
  Warnings:

  - A unique constraint covering the columns `[documento]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documento` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo_documento` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CPF', 'CNPJ');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "documento" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "tipo_documento",
ADD COLUMN     "tipo_documento" "TipoDocumento" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_documento_key" ON "Client"("documento");
