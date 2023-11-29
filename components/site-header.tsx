import Link from "next/link"

import { cn } from "@/lib/utils"
//import { CommandMenu } from "@/components/command-menu"
//import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
//import { MobileNav } from "@/components/mobile-nav"
//import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-10 flex h-14  px-4">
        <MainNav />

        <div className="ml-auto flex items-center space-x-4">
            <UserNav />
        </div>

        
      </div>
    </header>
  )
}