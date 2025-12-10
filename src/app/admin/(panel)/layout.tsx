'use client'

import AdminLayout from '@/page/admin/components/admin-layout'
import { adminRoutes } from '@/page/admin/routes/admin-routes'
import Logo from '@public/Eco-Tech-logo-web-no-background.ico'
import type { ReactNode } from 'react'
import { LoadingProvider } from '@/contexts/loading-context'
import { useNavigationLoading } from '@/hooks/use-navigation-loading'

function AdminPanelContent({ children }: { children: ReactNode }) {
  useNavigationLoading()
  
  return (
    <AdminLayout items={adminRoutes} logo={Logo}>
      {children}
    </AdminLayout>
  )
}

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <AdminPanelContent>{children}</AdminPanelContent>
    </LoadingProvider>
  )
}

