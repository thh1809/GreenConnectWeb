import React from 'react';
import Footer from './footer';
import Header from './header';

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main >{children}</main>
      <Footer />
    </>
  );
}

export default ClientLayout;
