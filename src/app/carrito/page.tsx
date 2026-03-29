import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import { getCart } from '@/actions/cart'
import { formatMXN } from '@/lib/format'
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import CartItemsList from './CartItemsList'
import type { CartItemData } from '@/types'

export const metadata: Metadata = {
  title: 'Mi Carrito — Cucú Becerra',
  description: 'Revisa los artículos en tu carrito de compras.',
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export default async function CarritoPage() {
  const cart = await getCart()
  const items = cart.items

  const subtotal = items.reduce((sum: number, item: CartItemData) => {
    const price =
      typeof item.variant.product.price === 'string'
        ? parseFloat(item.variant.product.price)
        : typeof item.variant.product.price === 'number'
          ? item.variant.product.price
          : item.variant.product.price.toNumber()
    return sum + price * item.quantity
  }, 0)

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? SHIPPING_COST : 0)
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 text-center">
        <svg className="mx-auto h-20 w-20 text-border mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <h1 className={`${cormorant.className} text-3xl font-semibold text-charcoal mb-4`}>
          Tu carrito está vacío
        </h1>
        <p className="text-gray-warm mb-8">
          Explora nuestra colección y encuentra la pieza perfecta.
        </p>
        <Button href="/tienda">Ir a la tienda</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <SectionHeader title="Tu Carrito" titleClassName={cormorant.className} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <CartItemsList
            items={items.map((item: CartItemData) => ({
              id: item.id,
              quantity: item.quantity,
              variant: {
                id: item.variant.id,
                size: item.variant.size,
                color: item.variant.color,
                product: {
                  name: item.variant.product.name,
                  slug: item.variant.product.slug,
                  price: item.variant.product.price,
                  images: item.variant.product.images,
                },
              },
            }))}
          />
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-white p-6 sticky top-28">
            <h2 className={`${cormorant.className} text-xl font-semibold text-charcoal mb-6`}>
              Resumen del pedido
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-warm">Subtotal</span>
                <span className="text-charcoal font-medium">{formatMXN(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-warm">Envío</span>
                <span className="text-charcoal font-medium">{formatMXN(shipping)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-charcoal">Total</span>
                <span className="font-semibold text-charcoal text-lg">{formatMXN(total)}</span>
              </div>
            </div>
            <div className="mt-6">
              <Button href="/checkout" className="w-full">
                Proceder al pago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
