-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_bankId_fkey";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "bankId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
