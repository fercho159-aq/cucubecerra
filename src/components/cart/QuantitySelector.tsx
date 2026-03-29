'use client'

import { useState } from 'react'
import { updateCartItem } from '@/actions/cart'

interface QuantitySelectorProps {
  itemId: string
  quantity: number
}

export default function QuantitySelector({ itemId, quantity: initialQty }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQty)
  const [updating, setUpdating] = useState(false)

  async function handleChange(newQty: number) {
    if (newQty < 1 || updating) return
    setUpdating(true)
    const prevQuantity = quantity
    setQuantity(newQty)
    try {
      await updateCartItem(itemId, newQty)
    } catch {
      setQuantity(prevQuantity)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleChange(quantity - 1)}
        disabled={quantity <= 1 || updating}
        className="flex h-7 w-7 items-center justify-center rounded border border-border text-charcoal hover:bg-beige transition-colors disabled:opacity-40"
        aria-label="Reducir cantidad"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <span className="w-6 text-center text-sm font-medium text-charcoal">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => handleChange(quantity + 1)}
        disabled={updating}
        className="flex h-7 w-7 items-center justify-center rounded border border-border text-charcoal hover:bg-beige transition-colors disabled:opacity-40"
        aria-label="Aumentar cantidad"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
