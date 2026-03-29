'use client'

import { useState, useEffect } from 'react'
import { createOrder } from '@/actions/orders'
import { getCart } from '@/actions/cart'
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

type CartItem = {
  id: string
  quantity: number
  variant: {
    id: string
    size: string
    color: string | null
    product: {
      name: string
      price: number | string
      images: string[]
    }
  }
}

type Cart = {
  id: string
  items: CartItem[]
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  useEffect(() => {
    async function loadCart() {
      try {
        const cartData = await getCart()
        setCart(cartData as unknown as Cart)
      } catch {
        setError('Error al cargar el carrito')
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  const subtotal = cart?.items.reduce(
    (sum, item) => sum + Number(item.variant.product.price) * item.quantity,
    0
  ) ?? 0

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? SHIPPING_COST : 0)
  const total = subtotal + shipping

  function formatPrice(amount: number) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  async function handleSubmit() {
    if (!cart || cart.items.length === 0) return

    setSubmitting(true)
    setError('')

    try {
      const order = await createOrder({
        cartId: cart.id,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        shippingAddress: shippingData.address,
        shippingCity: shippingData.city,
        shippingState: shippingData.state,
        shippingZip: shippingData.zip,
      })

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      })

      const data = await response.json()

      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        setError('Error al generar el enlace de pago')
      }
    } catch {
      setError('Error al procesar el pedido. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-gray-warm">Cargando...</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="text-gray-warm text-lg">Tu carrito está vacío</p>
        <a
          href="/tienda"
          className="bg-gold hover:bg-gold-dark text-white px-6 py-2 rounded transition-colors"
        >
          Ir a la tienda
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-light text-charcoal mb-8 text-center">
          Finalizar Compra
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? 'bg-gold text-white'
                    : 'bg-border text-gray-warm'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 ${
                    step > s ? 'bg-gold' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Customer data */}
        {step === 1 && (
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-medium text-charcoal mb-6">
              Datos del cliente
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm text-gray-warm mb-1">
                  Nombre completo
                </label>
                <input
                  id="customerName"
                  type="text"
                  value={customerData.name}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, name: e.target.value })
                  }
                  className="w-full border border-border rounded px-4 py-2 bg-cream focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm text-gray-warm mb-1">
                  Correo electrónico
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  value={customerData.email}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, email: e.target.value })
                  }
                  className="w-full border border-border rounded px-4 py-2 bg-cream focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm text-gray-warm mb-1">
                  Teléfono
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, phone: e.target.value })
                  }
                  className="w-full border border-border rounded px-4 py-2 bg-cream focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={
                !customerData.name || !customerData.email || !customerData.phone
              }
              className="mt-6 w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded font-medium transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Shipping address */}
        {step === 2 && (
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-medium text-charcoal mb-6">
              Dirección de envío
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="shippingAddress" className="block text-sm text-gray-warm mb-1">
                  Dirección
                </label>
                <input
                  id="shippingAddress"
                  type="text"
                  value={shippingData.address}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      address: e.target.value,
                    })
                  }
                  className="w-full border border-border rounded px-4 py-2 bg-cream focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shippingCity" className="block text-sm text-gray-warm mb-1">
                    Ciudad
                  </label>
                  <input
                    id="shippingCity"
                    type="text"
                    value={shippingData.city}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        city: e.target.value,
                      })
                    }
                    className="w-full border border-border rounded px-4 py-2 bg-cream focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shippingState" className="block text-sm text-gray-warm mb-1">
                    Estado
                  </label>
                  <input
                    id="shippingState"
                    type="text"
                    value={shippingData.state}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        state: e.target.value,
                      })
                    }
                    className="w-full border border-border rounded px-4 py-2 bg-cream focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="shippingZip" className="block text-sm text-gray-warm mb-1">
                  Código postal
                </label>
                <input
                  id="shippingZip"
                  type="text"
                  value={shippingData.zip}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, zip: e.target.value })
                  }
                  className="w-full border border-border rounded px-4 py-2 bg-cream focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-border text-charcoal py-3 rounded font-medium hover:bg-beige transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={
                  !shippingData.address ||
                  !shippingData.city ||
                  !shippingData.state ||
                  !shippingData.zip
                }
                className="flex-1 bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded font-medium transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order summary */}
        {step === 3 && (
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-medium text-charcoal mb-6">
              Resumen del pedido
            </h2>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-border pb-3"
                >
                  <div>
                    <p className="font-medium text-charcoal">
                      {item.variant.product.name}
                    </p>
                    <p className="text-sm text-gray-warm">
                      Talla: {item.variant.size}
                      {item.variant.color && ` | Color: ${item.variant.color}`}
                      {' | '}Cant: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-charcoal">
                    {formatPrice(
                      Number(item.variant.product.price) * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border pt-4 mb-4">
              <div className="flex justify-between text-gray-warm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-warm">
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-charcoal pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="bg-beige rounded p-4 mb-6 text-sm text-gray-warm space-y-1">
              <p>
                <strong>Cliente:</strong> {customerData.name}
              </p>
              <p>
                <strong>Email:</strong> {customerData.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {customerData.phone}
              </p>
              <p>
                <strong>Dirección:</strong> {shippingData.address},{' '}
                {shippingData.city}, {shippingData.state} {shippingData.zip}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-border text-charcoal py-3 rounded font-medium hover:bg-beige transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded font-medium transition-colors"
              >
                {submitting ? 'Procesando...' : 'Pagar con Mercado Pago'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
