import Link from 'next/link'
import Image from 'next/image'
import { formatMXN } from '@/lib/format'
import type { Decimal } from '@prisma/client/runtime/client'

interface ProductCardProps {
  product: {
    slug: string
    name: string
    price: Decimal | number | string
    images: string[]
  }
  serifClassName?: string
}

export default function ProductCard({ product, serifClassName = '' }: ProductCardProps) {
  const mainImage = product.images?.[0]

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group block rounded-lg overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-beige">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-16 w-16 text-border" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="pt-4 pb-2">
        <h3 className={`${serifClassName} text-lg font-semibold text-charcoal group-hover:text-gold transition-colors`}>
          {product.name}
        </h3>
        <p className="mt-1 text-gold-dark font-medium">
          {formatMXN(product.price)}
        </p>
      </div>
    </Link>
  )
}
