import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Administrative | Consultoria para Restaurantes em Balneário Camboriú e SC',
  description: 'Melhor consultoria de restaurantes em Santa Catarina. Escritório de performance focado em reestruturação financeira, lucro e processos para o setor de Food Service. Resultados reais em Balneário Camboriú.',
  keywords: [
    'Escritório de performance em Santa Catarina',
    'Consultoria para restaurantes em Santa Catarina',
    'Consultoria para restaurantes em Balneário Camboriú',
    'melhor consultoria de restaurantes',
    'consultoria resultado restaurantes',
    'Reestruturação financeira para restaurantes',
    'financeiro para restaurantes',
    'Administrative BI',
    'Gestão de restaurantes SC'
  ].join(', '),
  openGraph: {
    title: 'Administrative | Performance as a Service para Restaurantes',
    description: 'Aumente o lucro do seu restaurante com nossa consultoria especializada em performance e reestruturação financeira em SC.',
    url: 'https://administrativebi.com.br',
    siteName: 'Administrative BI',
    locale: 'pt_BR',
    type: 'website',
  },
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
