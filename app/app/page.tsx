

import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { NetworthTotal } from "./components/networth-total"
import { NetworthActivePasive } from "./components/networth-active-pasive"

import { BudgetTotal } from "./components/budget-total"
import { getMonthlyBalances, BalanceDetails } from '@/lib/transaction-actions'
import { AwardIcon } from "lucide-react"

/*
import { CalendarDateRangePicker } from "@/app/examples/dashboard/components/date-range-picker"
import { MainNav } from "@/app/examples/dashboard/components/main-nav"
import { Overview } from "@/app/examples/dashboard/components/overview"
import { RecentSales } from "@/app/examples/dashboard/components/recent-sales"
import { Search } from "@/app/examples/dashboard/components/search"
import TeamSwitcher from "@/app/examples/dashboard/components/team-switcher"
import { UserNav } from "@/app/examples/dashboard/components/user-nav"*/

  


export default async function DashboardPage() {

    const balances: BalanceDetails[] = await getMonthlyBalances();
    const totalBalances = balances.reduce(
        (acc: {
            [key: string]: { year: number, month: number, total: number, credit: number, debit: number};
          }, curr:  BalanceDetails) => {
            let key = String(curr.year) + '-' + String(curr.month);
            if (!acc[key]) {
                acc[key] = { year: curr.year, month: curr.month, total: 0, credit: 0, debit: 0 };
            }
            if(curr.transactionType === 'DEBIT'){
                acc[key].debit += parseFloat(curr.runningbalance.toFixed(2));
            }
            else{
                acc[key].credit += parseFloat(curr.runningbalance.toFixed(2));
            }
            acc[key].total += parseFloat(curr.runningbalance.toFixed(2));
            return acc;
        },
        {});

    
    
    const valuesTotalBalances = Object.values(totalBalances);
    const networthTotal = valuesTotalBalances.map((item: { year: number, month: number, total: number }) => ({
        name: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        total: item.total,
    }));

    const networthActivePasive = valuesTotalBalances.map(item => ({
        name: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        active: item.credit,
        pasive: item.debit,
     }));



    const networth = networthTotal[networthTotal.length - 1].total;
    let networthLastMonth = networthTotal[networthTotal.length - 2].total;
    const networthIncreasePercentage = (((networth - networthLastMonth) / networthLastMonth) * 100).toLocaleString(undefined, {maximumFractionDigits:2}) ;
    const networthFormatted= networth.toLocaleString(undefined, {maximumFractionDigits:2});

    const active = networthActivePasive[networthActivePasive.length - 1].active;
    let activeLastMonth = networthActivePasive[networthActivePasive.length - 2].active;
    const activeIncreasePercentage = (((active - activeLastMonth) / activeLastMonth) * 100).toLocaleString(undefined, {maximumFractionDigits:2}) ;
    const activeFormatted= active.toLocaleString(undefined, {maximumFractionDigits:2});
 
    const pasive = networthActivePasive[networthActivePasive.length - 1].pasive;
    let pasiveLastMonth = networthActivePasive[networthActivePasive.length - 2].pasive;
    const pasiveIncreasePercentage = (((pasive - pasiveLastMonth) / pasiveLastMonth) * 100).toLocaleString(undefined, {maximumFractionDigits:2}) ;
    const pasiveFormatted= pasive.toLocaleString(undefined, {maximumFractionDigits:2});
 

  return (
    <>

        <div className="ml-auto mt-2 flex items-center space-x-4">

        <div className="flex-1 space-y-4 p-8 pt-6">

          <Tabs defaultValue="networth" className="space-y-4">
            <TabsList>
                <TabsTrigger value="networth">Patrimonio</TabsTrigger>
                <TabsTrigger value="budget">
                    Presupuesto
                </TabsTrigger>
            </TabsList>
            <TabsContent value="networth" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Total Patrimonio
                        </CardTitle>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                        >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${networthFormatted}</div>
                        <p className="text-xs text-muted-foreground">
                        {networthIncreasePercentage}% del mes pasado
                        </p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Activo
                        </CardTitle>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                        >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${activeFormatted}</div>
                        <p className="text-xs text-muted-foreground">
                        {activeIncreasePercentage}% del mes pasado
                        </p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pasivo</CardTitle>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                        >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${pasiveFormatted}</div>
                        <p className="text-xs text-muted-foreground">
                        {pasiveIncreasePercentage}% del mes pasado
                        </p>
                    </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="total" className="space-y-4">
                    <TabsList>
                    <TabsTrigger value="total">Total</TabsTrigger>
                    <TabsTrigger value="activePasive" >
                        Activo/Pasivo
                    </TabsTrigger>
                    </TabsList>
                    <TabsContent value="total" className="space-y-4">

                    <div className="grid gap-4">
                        <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                         <NetworthTotal data={networthTotal} /> 
                        </CardContent>
                        </Card>
                    </div>
                    </TabsContent>

                    <TabsContent value="activePasive" className="space-y-4">

                    <div className="grid gap-4">
                        <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <NetworthActivePasive data={networthActivePasive} /> 
                        </CardContent>
                        </Card>
                    </div>
                    </TabsContent>
                </Tabs>

            </TabsContent>

            <TabsContent value="budget" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Presupuestado
                        </CardTitle>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                        >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                        </p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Gastado
                        </CardTitle>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                        >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                        +180.1% from last month
                        </p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Disponible</CardTitle>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                        >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                        +19% from last month
                        </p>
                    </CardContent>
                    </Card>
                </div>
                <Tabs defaultValue="totalBudget" className="space-y-4">
                    <TabsList>
                    <TabsTrigger value="totalBudget">Total</TabsTrigger>
                    <TabsTrigger value="detailBudget">
                        Por Categoria
                    </TabsTrigger>
                    </TabsList>
                    <TabsContent value="totalBudget" className="space-y-4">

                    <div className="grid gap-4 lg:grid-cols-3">
                        <Card >
                        <CardHeader>
                            <CardTitle>Cumplimiento</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                         <BudgetTotal /> 
                        </CardContent>
                        </Card>
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Cumplimiento presupuesto / mes</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <NetworthTotal /> 
                            </CardContent>
                        </Card>
                    </div>
                    </TabsContent>
                </Tabs>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  )
}