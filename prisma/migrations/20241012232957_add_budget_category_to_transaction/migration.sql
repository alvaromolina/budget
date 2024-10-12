/*
  Warnings:

  - You are about to drop the column `budgetLabelId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `BudgetLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_budgetLabelId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "budgetLabelId",
ADD COLUMN     "budgetCategoryId" TEXT;

-- DropTable
DROP TABLE "BudgetLabel";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_budgetCategoryId_fkey" FOREIGN KEY ("budgetCategoryId") REFERENCES "budget_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
