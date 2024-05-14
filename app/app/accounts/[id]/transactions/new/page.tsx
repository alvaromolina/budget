import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/ui/accounts/account-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import prisma from "@/lib/prisma";
import { TransactionForm } from "@/components/ui/transactions/transaction-form";


export default async function Page({ params }: { params: { id: string } }) {

  const accountId = params.id;

  const budgetLabels = await prisma.budgetLabel.findMany({});

  return (
    <>
      <PageHeader className="">
      <PageHeaderHeading></PageHeaderHeading>
      <PageHeaderDescription>
      </PageHeaderDescription>
      </PageHeader>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Transactions</h3>
          <p className="text-sm text-muted-foreground">
            Update your transactions
          </p>
        </div>
        <Separator />
        <TransactionForm accountId={accountId} budgetLabels={budgetLabels}  />
      </div>
    </>
  )
}