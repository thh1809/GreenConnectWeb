import ClientLayout from '@/page/homepage/components/layout';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}

export default layout;
