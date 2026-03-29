'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatMXN } from '@/lib/format'
import { removeFromCart } from '@/actions/cart'
import QuantitySelector from '@/components/cart/QuantitySelector'
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

interface CartItemsListProps {
  items: CartItem[]
}

export default function CartItemsList({ items }: CartItemsListProps) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const image = item.variant.product.images?.[0]
        return (
          <li key={item.id} className="flex gap-6 py-6 first:pt-0 last:pb-0">
            <Link
              href={`/tienda/${item.variant.product.slug}`}
              className="relative h-28 w-22 shrink-0 rounded-lg bg-beige overflow-hidden"
            >
              {image ? (
                <Image
                  src={image}
                  alt={item.variant.product.name}
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-8 w-8 text-border" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                </div>
              )}
            </Link>
            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div>
                <Link href={`/tienda/${item.variant.product.slug}`} className="font-medium text-charcoal hover:text-gold transition-colors">
                  {item.variant.product.name}
                </Link>
                <p className="text-sm text-gray-warm mt-0.5">
                  Talla: {item.variant.size}
                  {item.variant.color ? ` / ${item.variant.color}` : ''}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <QuantitySelector itemId={item.id} quantity={item.quantity} />
                <p className="font-medium text-gold-dark">
                  {formatMXN(item.variant.product.price)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await removeFromCart(item.id)
              }}
              className="self-start text-gray-warm hover:text-error transition-colors mt-1"
              aria-label="Eliminar producto"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
