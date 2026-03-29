'use client'

import { useState } from 'react'
import AddToCartButton from '@/components/cart/AddToCartButton'

interface Variant {
  id: string
  size: string
  color: string | null
  stock: number
}

interface VariantSelectorProps {
  variants: Variant[]
  defaultVariantId?: string
  hasStock: boolean
}

export default function VariantSelector({
  variants,
  defaultVariantId,
  hasStock,
}: VariantSelectorProps) {
  const [selectedId, setSelectedId] = useState(defaultVariantId ?? variants[0]?.id ?? '')
  const selectedVariant = variants.find((v) => v.id === selectedId)

  const sizes = [...new Set(variants.map((v) => v.size))]
  const colors = [...new Set(variants.filter((v) => v.color).map((v) => v.color!))]

  return (
    <div className="space-y-6">
      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Talla
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = variants.find((v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color))
              const isSelected = selectedVariant?.size === size
              const outOfStock = variant ? variant.stock === 0 : true

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (variant) setSelectedId(variant.id)
                  }}
                  disabled={outOfStock}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-gold bg-gold text-white'
                      : outOfStock
                        ? 'border-border text-border cursor-not-allowed'
                        : 'border-border text-charcoal hover:border-gold'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = variants.find((v) => v.color === color && v.size === (selectedVariant?.size ?? sizes[0]))
              const isSelected = selectedVariant?.color === color

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    if (variant) setSelectedId(variant.id)
                  }}
                  disabled={!variant || variant.stock === 0}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-gold bg-gold text-white'
                      : !variant || variant.stock === 0
                        ? 'border-border text-border cursor-not-allowed'
                        : 'border-border text-charcoal hover:border-gold'
                  }`}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      {selectedVariant && (
        <p className="text-sm">
          {selectedVariant.stock > 0 ? (
            <span className="text-success">
              {selectedVariant.stock <= 3
                ? `Solo quedan ${selectedVariant.stock} disponibles`
                : 'En existencia'}
            </span>
          ) : (
            <span className="text-error">Agotado</span>
          )}
        </p>
      )}

      {/* Add to cart */}
      <AddToCartButton
        variantId={selectedId}
        disabled={!hasStock || !selectedVariant || selectedVariant.stock === 0}
      />
    </div>
  )
}
