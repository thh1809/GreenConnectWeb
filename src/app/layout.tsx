import { Providers } from '@/components/providers';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GreenConnect',
  description: 'GreenConnect - Connecting you to green solutions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDark = false;
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${
          isDark ? 'dark' : ''
        } font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
