-- CreateEnum
CREATE TYPE "TipoCobranca" AS ENUM ('HORA', 'DIARIA', 'MENSAL');

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "tipo_cobranca" "TipoCobranca" NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "tlerancia_minutos" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VehicleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
