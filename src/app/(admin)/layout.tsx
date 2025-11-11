import AdminLayout from '@/page/admin/components/admin-layout';
import { adminRoutes } from '@/page/admin/routes/admin-routes';
import Logo from '@public/Eco-Tech-logo-web-no-background.ico';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout items={adminRoutes} logo={Logo}>
      {children}
    </AdminLayout>
  );
}

export default layout;
