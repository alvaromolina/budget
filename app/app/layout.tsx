import { SiteHeader } from '@/components/site-header'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <SiteHeader />
        <div className="flex-1">
        <div className="container relative">
          {children}
        </div>
        </div>
    </>
  );
}