'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 text-center">
      <h1 className="text-4xl font-semibold text-charcoal mb-4">Algo salio mal</h1>
      <p className="text-gray-warm mb-8">Lo sentimos, ocurrio un error inesperado.</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-white hover:bg-gold-dark transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
