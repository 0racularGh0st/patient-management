import './globals.scss'
import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import Nav from '@components/Nav'
import AuthProvider from '@utils/authProvider'
import { ContentLayout } from '@components/contentLayout'
import { ThemeProvider } from '@components/theme-provider'
import { Toaster } from "@/components/ui/toaster"

// Editorial pairing: Fraunces (optical serif) for display, Hanken Grotesk for UI/body.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  display: 'swap',
})
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Patient Manager',
  description: 'Developed by Nigel Tariang',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${hanken.variable} ${fraunces.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <ThemeProvider attribute='class' defaultTheme="light">
          <AuthProvider>
            <div className="page-shell">
              <Nav />
              <ContentLayout>
                {children}
              </ContentLayout>
            </div>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
