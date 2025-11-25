import AdminLayout from '@/page/admin/components/admin-layout'
import { adminRoutes } from '@/page/admin/routes/admin-routes'
import Logo from '@public/Eco-Tech-logo-web-no-background.ico'
import type { ReactNode } from 'react'

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout items={adminRoutes} logo={Logo}>
      {children}
    </AdminLayout>
  )
}

