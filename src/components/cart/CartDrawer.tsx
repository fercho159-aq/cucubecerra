'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatMXN } from '@/lib/format'
import { updateCartItem, removeFromCart } from '@/actions/cart'
import QuantitySelector from './QuantitySelector'
import type { Decimal } from '@prisma/client/runtime/client'

interface CartItem {
  id: string
  quantity: number
  variant: {
    id: string
    size: string
    color: string | null
    product: {
      name: string
      slug: string
      price: Decimal | number | string
      images: string[]
    }
  }
}

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
}

export default function CartDrawer({ open, onClose, items }: CartDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  const subtotal = items.reduce((sum: number, item: any) => {
    const price =
      typeof item.variant.product.price === 'string'
        ? parseFloat(item.variant.product.price)
        : typeof item.variant.product.price === 'number'
          ? item.variant.product.price
          : item.variant.product.price.toNumber()
    return sum + price * item.quantity
  }, 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div role="dialog" aria-modal="true" aria-label="Carrito de compras" className="absolute top-0 right-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-charcoal">
            Carrito ({items.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-warm hover:text-charcoal transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="h-16 w-16 text-border mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="text-gray-warm">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => {
                const image = item.variant.product.images?.[0]
                return (
                  <li key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-16 shrink-0 rounded bg-beige overflow-hidden">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg className="h-6 w-6 text-border" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">
                        {item.variant.product.name}
                      </p>
                      <p className="text-xs text-gray-warm mt-0.5">
                        Talla: {item.variant.size}
                        {item.variant.color ? ` / ${item.variant.color}` : ''}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <QuantitySelector
                          itemId={item.id}
                          quantity={item.quantity}
                        />
                        <p className="text-sm font-medium text-gold-dark">
                          {formatMXN(item.variant.product.price)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await removeFromCart(item.id)
                      }}
                      className="self-start text-gray-warm hover:text-error transition-colors"
                      aria-label="Eliminar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-charcoal">Subtotal</span>
              <span className="font-semibold text-charcoal">{formatMXN(subtotal)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/carrito"
                onClick={onClose}
                className="flex items-center justify-center rounded-full border-2 border-gold px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold hover:text-white transition-colors"
              >
                Ver carrito
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white hover:bg-gold-dark transition-colors"
              >
                Proceder al pago
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
