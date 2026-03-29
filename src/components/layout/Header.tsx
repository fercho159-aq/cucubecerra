'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface HeaderProps {
  cartCount: number
  serifClassName: string
}

export default function Header({ cartCount, serifClassName }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : ''
      } bg-cream/90 backdrop-blur-md border-b border-border`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Abrir menú"
          className="md:hidden text-charcoal"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Desktop nav left */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/tienda" className="text-sm tracking-wide text-charcoal hover:text-gold transition-colors">
            Tienda
          </Link>
          <Link href="/nosotros" className="text-sm tracking-wide text-charcoal hover:text-gold transition-colors">
            Nosotros
          </Link>
        </nav>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <span className={`${serifClassName} text-2xl md:text-3xl font-semibold text-charcoal`}>
            Cucú Becerra
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/contacto" className="text-sm tracking-wide text-charcoal hover:text-gold transition-colors">
              Contacto
            </Link>
          </nav>
          <Link href="/carrito" aria-label="Ver carrito" className="relative text-charcoal hover:text-gold transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-cream px-4 pb-4">
          <div className="flex flex-col gap-4 pt-4">
            <Link
              href="/tienda"
              className="text-charcoal hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link
              href="/nosotros"
              className="text-charcoal hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className="text-charcoal hover:text-gold transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
