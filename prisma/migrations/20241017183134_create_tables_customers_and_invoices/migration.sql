-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "customerNumber" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "installationNumber" BIGINT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "energyQuantity" DECIMAL(10,3) NOT NULL,
    "energyAmount" DECIMAL(10,2) NOT NULL,
    "exemptEnergyQuantity" DECIMAL(10,3),
    "exemptEnergyAmount" DECIMAL(10,2),
    "compensatedEnergyQuantity" DECIMAL(10,3),
    "compensatedEnergyAmount" DECIMAL(10,2),
    "municipalPublicLightingContribution" DECIMAL(10,3) NOT NULL,
    "invoiceUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" BIGINT NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_customerNumber_key" ON "customers"("customerNumber");

-- CreateIndex
CREATE INDEX "invoices_customerId_idx" ON "invoices"("customerId");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("customerNumber") ON DELETE CASCADE ON UPDATE CASCADE;
