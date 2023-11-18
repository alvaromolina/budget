import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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

export default function Accounts() {
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
            href="/accounts/new">
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
    <TableRow>
      <TableCell className="font-medium">Cuenta BNB</TableCell>
      <TableCell>Caja de ahorro</TableCell>
      <TableCell>BNB</TableCell>
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
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Ver transacciones
            </DropdownMenuItem>
            <DropdownMenuItem>Añadir transaccion</DropdownMenuItem>
            <DropdownMenuItem>Importar transacciones</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
      </>
  )
}
