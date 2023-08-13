import { Modal } from '@/components/Modal'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Trello Clone',
  description: 'Consolidando conhecimentos em Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-[#f5f6f8]'>
        {children}
        <Modal />
        </body>
    </html>
  )
}
