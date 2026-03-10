import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Administrative | Performance as a Service',
  description: 'Pare de gerir por instinto. Entregamos Estados de Eficiência para o setor de Food Service.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0A0A0A] text-white antialiased`}>{children}</body>
    </html>
  )
}
