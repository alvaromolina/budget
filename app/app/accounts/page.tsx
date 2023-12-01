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
import { deleteAccount } from '@/lib/account-actions'

export default async function Accounts() {
  const session = await auth();
  const userId = session?.user?.id;
  const accounts = await prisma.account.findMany({where: {userId: userId}, include: {
    bank: true,
  }});
  
  return (
    <>
      <PageHeader className="">
        <PageHeaderHeading>Cuentas</PageHeaderHeading>
        <PageHeaderDescription>
         Administra tus cuentas:  bancos, efectivo, creditos, bienes, inversiones y otras
        </PageHeaderDescription>
      </PageHeader>
        <div className="float-right">
            <Link
            href="/app/accounts/new">
                <Button>
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Añadir cuenta
                </Button>
            </Link>
        </div>

        <Table>
  <TableCaption>Un listado de tus cuentas.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Tipo</TableHead>
      <TableHead>Banco</TableHead>
      <TableHead className="text-right">Balance</TableHead>

    </TableRow>
  </TableHeader>
  <TableBody>
    {accounts.map((account) => (
      <TableRow key={account.id}>
        <TableCell className="font-medium"> { account.name }</TableCell>
        <TableCell>{ account.accountType }</TableCell>
        <TableCell>{ account.bank.name }</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/app/accounts/${account.id}/edit`}>Editar</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="">Ver transacciones</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Añadir transaccion</DropdownMenuItem>
              <DropdownMenuItem>Importar transacciones</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form className="flex w-full items-left"
                      action={async () => {
                          'use server';
                          await deleteAccount(account.id);
                      }}
                      >
                      <button className="text-red-600 flex w-full">
                      Eliminar
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
