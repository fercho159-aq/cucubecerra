import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 text-center">
      <h1 className="text-6xl font-semibold text-charcoal mb-4">404</h1>
      <p className="text-xl text-gray-warm mb-8">Página no encontrada</p>
      <p className="text-gray-warm mb-8">Lo sentimos, la página que buscas no existe o fue movida.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-white hover:bg-gold-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
