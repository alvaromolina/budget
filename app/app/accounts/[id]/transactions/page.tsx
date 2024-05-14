
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import prisma from "@/lib/prisma";

import { PlusCircledIcon } from "@radix-ui/react-icons"

import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
  } from "@/components/page-header"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { auth } from '@/auth';
import { deleteTransaction } from '@/lib/transaction-actions'

export default async function Transactions({ params }: { params: { id: string } }) {
  const accountId = params.id;
  const session = await auth();
  const userId = session?.user?.id;
  const transactions = await prisma.transaction.findMany({where: {accountId: accountId}});
  
  return (
    <>
      <PageHeader className="">
        <PageHeaderHeading>Transactions</PageHeaderHeading>
        <PageHeaderDescription>
         Manage your transactions
        </PageHeaderDescription>
      </PageHeader>
        <div className="float-right">
            <Link
            href={`/app/accounts/${accountId}/transactions/new`}>
                <Button>
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </Link>
        </div>

        <Table>
  <TableCaption>A list of your transactions.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Transaction Type</TableHead>
      <TableHead>Value</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Account ID</TableHead>
      <TableHead>Budget Label ID</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Reference</TableHead>
      <TableHead>Additional Reference</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {transactions.map((transaction) => (
      <TableRow key={transaction.id}>
        <TableCell>{ transaction.value.toString() }</TableCell>
        <TableCell>{ transaction.dateTransaction.toLocaleDateString() }</TableCell>
        <TableCell>{ transaction.accountId }</TableCell>
        <TableCell>{ transaction.budgetLabelId }</TableCell>
        <TableCell>{ transaction.description }</TableCell>
        <TableCell>{ transaction.reference }</TableCell>
        <TableCell>{ transaction.additionalReference }</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/app/accounts/${transaction.id}/transactions/${transaction.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form className="flex w-full items-left"
                      action={async () => {
                          'use server';
                          await deleteTransaction(transaction.id);
                      }}
                      >
                      <button className="text-red-600 flex w-full">
                      Delete
                      </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
      </>
  )
}