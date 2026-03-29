import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { getCartCount } from '@/actions/cart'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://cucubecerra.com'),
  title: 'Cucú Becerra — Ropones y Trajes de Bautizo Artesanales | CDMX',
  description:
    'Ropones y trajes de bautizo artesanales confeccionados a mano en la Ciudad de México. Tradición, calidad y elegancia para el día más especial de tu bebé.',
  openGraph: {
    title: 'Cucú Becerra — Ropones y Trajes de Bautizo Artesanales',
    description:
      'Ropones y trajes de bautizo artesanales confeccionados a mano en la Ciudad de México.',
    images: [
      {
        url: '/images/og-cucu-becerra.png',
        width: 1200,
        height: 630,
        alt: 'Cucú Becerra - Ropones y Trajes de Bautizo Artesanales',
      },
    ],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cartCount = await getCartCount()

  return (
    <html lang="es" className={`${inter.className} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <Header cartCount={cartCount} serifClassName={cormorant.className} />
        <main className="flex-1">{children}</main>
        <Footer serifClassName={cormorant.className} />
        <WhatsAppButton />
      </body>
    </html>
  )
}
