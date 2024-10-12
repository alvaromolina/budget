import { Separator } from "@/components/ui/separator"
import { TransactionForm } from "@/components/ui/transactions/transaction-form"
import { Transaction } from "@prisma/client"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';


export default async function Page({ params }: { params: { id: string, transactionId: string } }) {
  const transactionId = params.transactionId;
  const accountId = params.transactionId;
  const budgetCategories = await prisma.budgetCategory.findMany({});
  const transaction = await prisma.transaction.findUnique({
    where: {
        id: transactionId,
    },
  });
  
  if (!transaction) {
    notFound();
  }


  return (
    <>
      <PageHeader className="">
      <PageHeaderHeading></PageHeaderHeading>
      <PageHeaderDescription>
      </PageHeaderDescription>
      </PageHeader>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Cuenta</h3>
          <p className="text-sm text-muted-foreground">
            Update your transaction data.
          </p>
        </div>
        <Separator />
        <TransactionForm transaction={transaction} accountId={accountId} budgetCategories={budgetCategories}  />
      </div>
    </>
  )
}