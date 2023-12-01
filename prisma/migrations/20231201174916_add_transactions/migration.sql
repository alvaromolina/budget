-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "BudgetLabel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,

    CONSTRAINT "BudgetLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "dateTransaction" TIMESTAMP(3) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "accountId" TEXT NOT NULL,
    "budgetLabelId" TEXT NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "additionalReference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_budgetLabelId_fkey" FOREIGN KEY ("budgetLabelId") REFERENCES "BudgetLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
