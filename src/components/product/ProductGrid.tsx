import ProductCard from './ProductCard'
import type { Decimal } from '@prisma/client/runtime/client'

interface Product {
  id: string
  slug: string
  name: string
  price: Decimal | number | string
  images: string[]
}

interface ProductGridProps {
  products: Product[]
  serifClassName?: string
}

export default function ProductGrid({ products, serifClassName = '' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-warm text-lg">No se encontraron productos.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          serifClassName={serifClassName}
        />
      ))}
    </div>
  )
}
