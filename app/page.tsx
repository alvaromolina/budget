import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"


import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import DashboardPage from "./app/page"

export default function Page() {
  return (
    <div className="container relative">

     { /* 
      <PageHeader className="pb-8">

        <PageHeaderHeading>Tu dinero a tu manera.</PageHeaderHeading>
        <PageHeaderDescription>
         Presupuestos y administración de inversiones de forma facil.
        </PageHeaderDescription>

      </PageHeader>  */}
      <section className="block">
        <div className="overflow-hidden mt-4 rounded-lg border bg-background shadow">
          
        </div>
      </section>
    </div>
  )
}
