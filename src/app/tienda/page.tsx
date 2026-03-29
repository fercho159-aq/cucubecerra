import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import { getProducts } from '@/actions/products'

export const metadata: Metadata = {
  title: 'Tienda — Cucú Becerra',
  description: 'Explora nuestra colección de ropones y trajes de bautizo artesanales.',
}
import { getCategories } from '@/actions/categories'
import ProductGrid from '@/components/product/ProductGrid'
import SectionHeader from '@/components/ui/SectionHeader'
import CatalogFilters from './CatalogFilters'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

interface TiendaPageProps {
  searchParams: Promise<{
    categoria?: string
    orden?: string
    min?: string
    max?: string
  }>
}

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const params = await searchParams
  const categories = await getCategories()

  const products = await getProducts({
    categorySlug: params.categoria,
    sortBy: params.orden,
    minPrice: params.min ? parseFloat(params.min) : undefined,
    maxPrice: params.max ? parseFloat(params.max) : undefined,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <SectionHeader
        title="Nuestra Colección"
        subtitle="Piezas artesanales confeccionadas con amor para los momentos más especiales"
        titleClassName={cormorant.className}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <CatalogFilters
            categories={categories}
            currentCategory={params.categoria}
            currentSort={params.orden}
          />
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-warm">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          <ProductGrid
            products={products}
            serifClassName={cormorant.className}
          />
        </div>
      </div>
    </div>
  )
}
