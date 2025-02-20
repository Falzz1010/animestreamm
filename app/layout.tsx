import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers'
import { WelcomeDialog } from "@/components/welcome-dialog"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AnimeStream',
  description: 'Watch your favorite anime in HD quality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="min-h-screen flex flex-col overflow-x-hidden">
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <WelcomeDialog />
                <Footer />
                <Toaster />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}