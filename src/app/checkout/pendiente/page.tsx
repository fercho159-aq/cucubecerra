import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pago Pendiente — Cucú Becerra',
  description: 'Tu pago está siendo procesado.',
}

export default function CheckoutPendientePage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-light text-charcoal mb-2">
          Pago pendiente
        </h1>
        <p className="text-gray-warm mb-6">
          Tu pago está siendo procesado. Te enviaremos un correo electrónico
          cuando se confirme. Esto puede tardar unos minutos.
        </p>

        <Link
          href="/"
          className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded font-medium transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
