

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
import { BudgetTotal } from "./components/budget-total"
import { getMonthlyBalances } from '@/lib/transaction-actions'
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

    const balances = await getMonthlyBalances();

    const formattedData = balances.map(item => ({
        name: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        total: item.runningbalance.toFixed(2),
     }));


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
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                        +20.1% from last month
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
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                        +180.1% from last month
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
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                        +19% from last month
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
                    <TabsTrigger value="detail">
                        Detalle
                    </TabsTrigger>
                    </TabsList>
                    <TabsContent value="total" className="space-y-4">

                    <div className="grid gap-4">
                        <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                         <NetworthTotal data={formattedData} /> 
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