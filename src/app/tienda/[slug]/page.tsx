import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Cormorant_Garamond } from 'next/font/google'
import { getProductBySlug } from '@/actions/products'
import { formatMXN } from '@/lib/format'
import Badge from '@/components/ui/Badge'
import AddToCartButton from '@/components/cart/AddToCartButton'
import VariantSelector from './VariantSelector'
import type { VariantData } from '@/types'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

interface PDPProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: `${product.name} | Cucú Becerra`,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: PDPProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const mainImage = product.images?.[0]
  const hasStock = product.variants.some((v: VariantData) => v.stock > 0)
  const defaultVariant = product.variants.find((v: VariantData) => v.stock > 0) ?? product.variants[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-beige">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-24 w-24 text-border" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded bg-beige"
                >
                  <Image
                    src={img}
                    alt={`${product.name} - imagen ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {product.category && (
            <p className="text-sm text-gray-warm uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
          )}
          <h1
            className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-charcoal`}
          >
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-gold">
            {formatMXN(product.price)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Hecho a mano</Badge>
            {!hasStock && <Badge variant="error">Agotado</Badge>}
          </div>

          {/* Variant selector + Add to cart (client component) */}
          <div className="mt-8">
            <VariantSelector
              variants={product.variants.map((v: VariantData) => ({
                id: v.id,
                size: v.size,
                color: v.color,
                stock: v.stock,
              }))}
              defaultVariantId={defaultVariant?.id}
              hasStock={hasStock}
            />
          </div>

          {/* Description */}
          <div className="mt-10 border-t border-border pt-8">
            <h2 className={`${cormorant.className} text-xl font-semibold text-charcoal mb-4`}>
              Descripción
            </h2>
            <div className="prose prose-sm text-gray-warm leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
