/*
  Warnings:

  - You are about to drop the column `transactionType` on the `BudgetLabel` table. All the data in the column will be lost.
  - You are about to drop the column `transactionType` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BudgetLabel" DROP COLUMN "transactionType";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transactionType";

-- DropEnum
DROP TYPE "TransactionType";
