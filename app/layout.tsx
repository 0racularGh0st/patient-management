import './globals.css'
import type { Metadata } from 'next'
import { Inter, Quicksand } from 'next/font/google'
import Nav from '@components/Nav'
import AuthProvider from '@utils/authProvider'
import { ContentLayout } from '@components/contentLayout'

const quicksand = Quicksand({ subsets: ['latin'] })

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
      <body className={quicksand.className}>
        <main>
        <div className='background-elements'>
          <div className='circle1'/>
          <div className='circle2'/>
          <div className='circle3'/>
          <div className='circle4'/>
          <div className='circle5'/>
          <div className='circle6'/>
          <div className='background-back'/>
        </div>
          <AuthProvider>
            <Nav />
            <ContentLayout>
              {children}
            </ContentLayout>
          </AuthProvider>
        </main>
      </body>
    </html>
  )
}

