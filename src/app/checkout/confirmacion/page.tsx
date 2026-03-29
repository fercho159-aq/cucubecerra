import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pedido Confirmado — Cucú Becerra',
  description: 'Tu pedido ha sido registrado exitosamente.',
}

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment_id?: string
    external_reference?: string
    status?: string
    collection_status?: string
  }>
}) {
  const params = await searchParams
  const status = params.status || params.collection_status || 'unknown'
  const orderNumber = params.external_reference || ''
  const paymentId = params.payment_id || ''

  const isApproved = status === 'approved'
  const isPending = status === 'pending' || status === 'in_process'
  const isFailed = !isApproved && !isPending

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        {/* Status icon */}
        <div className="mb-6">
          {isApproved && (
            <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {isPending && (
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
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
          )}
          {isFailed && (
            <div className="w-20 h-20 mx-auto rounded-full bg-error/10 flex items-center justify-center">
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
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-light text-charcoal mb-2">
          {isApproved && 'Pago aprobado'}
          {isPending && 'Pago pendiente'}
          {isFailed && 'Pago no procesado'}
        </h1>

        {/* Description */}
        <p className="text-gray-warm mb-6">
          {isApproved &&
            'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación.'}
          {isPending &&
            'Tu pago está siendo procesado. Te notificaremos cuando se confirme.'}
          {isFailed &&
            'Hubo un problema al procesar tu pago. Por favor intenta de nuevo.'}
        </p>

        {/* Order details */}
        <div className="bg-white rounded-lg border border-border p-6 mb-6 text-left">
          {orderNumber && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-warm text-sm">Número de orden</span>
              <span className="font-medium text-charcoal">{orderNumber}</span>
            </div>
          )}
          {paymentId && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-warm text-sm">ID de pago</span>
              <span className="font-medium text-charcoal text-sm">
                {paymentId}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-warm text-sm">Estado</span>
            <span
              className={`font-medium text-sm ${
                isApproved
                  ? 'text-success'
                  : isPending
                    ? 'text-yellow-600'
                    : 'text-error'
              }`}
            >
              {isApproved && 'Aprobado'}
              {isPending && 'Pendiente'}
              {isFailed && 'Rechazado'}
            </span>
          </div>
        </div>

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
