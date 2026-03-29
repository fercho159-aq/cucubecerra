import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout — Cucú Becerra',
  description: 'Completa tu compra de ropa artesanal de bautizo.',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
