import { Separator } from "@/components/ui/separator"
import { AccountForm } from "./components/account-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"


export default function SettingsAccountPage() {
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
        <AccountForm />
      </div>
    </>
  )
}