import Link from 'next/link'

interface FooterProps {
  serifClassName: string
}

export default function Footer({ serifClassName }: FooterProps) {
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className={`${serifClassName} text-2xl font-semibold`}>
              Cucú Becerra
            </span>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Ropones y trajes de bautizo artesanales, confeccionados con amor
              en la Ciudad de México.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Tienda
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tienda" className="text-sm text-white/60 hover:text-gold transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/categorias/ropones" className="text-sm text-white/60 hover:text-gold transition-colors">
                  Ropones
                </Link>
              </li>
              <li>
                <Link href="/categorias/bombachos" className="text-sm text-white/60 hover:text-gold transition-colors">
                  Bombachos
                </Link>
              </li>
              <li>
                <Link href="/categorias/accesorios" className="text-sm text-white/60 hover:text-gold transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Información
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/nosotros" className="text-sm text-white/60 hover:text-gold transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-white/60 hover:text-gold transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Cda. Felix Cuevas 13, Tlacoquemecatl del Valle, CDMX</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <a href="tel:+525558036177" className="hover:text-gold transition-colors">
                  55 8036 6177
                </a>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/5558036177"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-white/60 hover:text-green-400 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/cucubecerra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/60 hover:text-pink-400 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/40">
            &copy; 2026 Cucú Becerra. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
