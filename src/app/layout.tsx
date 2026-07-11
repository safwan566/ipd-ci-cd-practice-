import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers/Providers';

export const metadata: Metadata = {
  title: 'IDP Frontend',
  description: 'Identity Provider Frontend with Next.js, TypeScript, and TanStack Query',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className=" dark:bg-dark text-gray-900 dark:text-white">

        <main className='main-bg '>
          <Providers>


            {children}


          </Providers>
        </main>

      </body>
    </html>
  );
}
