import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from '@components/Nav'
import AuthProvider from '@utils/authProvider'
import { ContentLayout } from '@components/contentLayout'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <main>
          <AuthProvider>
            <Nav />
            <ContentLayout>
              {children}
            </ContentLayout>
          </AuthProvider>
        </main>
        <div className='circle1'/>
        <div className='circle2'/>
        <div className='circle3'/>
      </body>
    </html>
  )
}

