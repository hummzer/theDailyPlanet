import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata = {
  title: 'thedailyplanet',
  description: 'A personal blog application built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black min-h-screen`}>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
