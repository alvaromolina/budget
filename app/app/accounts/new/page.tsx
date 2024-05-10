import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/ui/accounts/account-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";


export default async function Page() {

  const banks = await prisma.bank.findMany({});
  const accountTypes = Object.values(AccountType);

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
        <AccountForm accountTypes={accountTypes}banks={banks} />
      </div>
    </>
  )
}