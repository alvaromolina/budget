-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_budgetLabelId_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "budgetLabelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_budgetLabelId_fkey" FOREIGN KEY ("budgetLabelId") REFERENCES "BudgetLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
