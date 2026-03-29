'use client'

import { useState } from 'react'
import { addToCart } from '@/actions/cart'
import Button from '@/components/ui/Button'

interface AddToCartButtonProps {
  variantId: string
  disabled?: boolean
}

export default function AddToCartButton({ variantId, disabled = false }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      await addToCart(variantId, 1)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar al carrito")
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        loading={loading}
        disabled={disabled}
        onClick={handleClick}
        className="w-full"
      >
        {success ? (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Agregado
          </>
        ) : (
          'Agregar al carrito'
        )}
      </Button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </>
  )
}
