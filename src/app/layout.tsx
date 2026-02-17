import { Inter } from 'next/font/google';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: '/Bookmarkr_favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}
      >
        {children}
      </body>
    </html>
  );
}
