import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Illie',
  description: 'Gerencie seus posts gerados pelo pipeline Notion → LinkedIn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-[220px]">
            <div className="max-w-[960px] mx-auto px-8 py-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
