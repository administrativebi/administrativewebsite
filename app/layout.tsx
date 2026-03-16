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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Administrative BI",
    "image": "https://administrativebi.com.br/img/LogoHorizontal.png",
    "@id": "https://administrativebi.com.br",
    "url": "https://administrativebi.com.br",
    "telephone": "+5547999255801",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Balneário Camboriú",
      "addressLocality": "Balneário Camboriú",
      "addressRegion": "SC",
      "postalCode": "88330-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -26.9934,
      "longitude": -48.6340
    },
    "servesCuisine": "Food Service",
    "priceRange": "$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://wa.me/5547999255801"
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Consultoria para Restaurantes",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Administrative BI"
    },
    "areaServed": {
      "@type": "State",
      "name": "Santa Catarina"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Performance",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reestruturação Financeira para Restaurantes"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Gestão de Performance Operacional"
          }
        }
      ]
    }
  };

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-[#0A0A0A] text-white antialiased`}>{children}</body>
    </html>
  )
}
