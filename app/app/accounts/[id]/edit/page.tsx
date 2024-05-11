import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/ui/accounts/account-form"
import { MoneyAccount } from "@prisma/client"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';
import { AccountType } from "@prisma/client"


export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const banks = await prisma.bank.findMany({});
  const accountTypes = Object.values(AccountType);

  const account = await prisma.moneyAccount.findUnique({
    where: {
      id,
    },
  });
  
  if (!account) {
    notFound();
  }
  delete (account as Partial<MoneyAccount>)['balance']


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
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
        <Separator />
        <AccountForm account={account} accountTypes={accountTypes} banks={banks}  />
      </div>
    </>
  )
}