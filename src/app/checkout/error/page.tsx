import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Error en el Pago — Cucú Becerra',
  description: 'Hubo un problema con tu pago.',
}

export default function CheckoutErrorPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-error/10 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-light text-charcoal mb-2">
          Error en el pago
        </h1>
        <p className="text-gray-warm mb-6">
          Hubo un problema al procesar tu pago. Por favor intenta de nuevo o
          utiliza otro método de pago.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/carrito"
            className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded font-medium transition-colors"
          >
            Volver al carrito
          </Link>
          <Link
            href="/"
            className="border border-border text-charcoal px-6 py-3 rounded font-medium hover:bg-beige transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
