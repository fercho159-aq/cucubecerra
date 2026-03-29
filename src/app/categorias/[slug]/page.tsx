import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Cormorant_Garamond } from 'next/font/google'
import { getCategoryBySlug } from '@/actions/categories'
import { getProductsByCategory } from '@/actions/products'
import ProductGrid from '@/components/product/ProductGrid'
import SectionHeader from '@/components/ui/SectionHeader'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Categoría no encontrada' }

  return {
    title: `${category.name} | Cucú Becerra`,
    description: category.description ?? `Explora nuestra colección de ${category.name.toLowerCase()}.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) notFound()

  const products = await getProductsByCategory(slug)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <SectionHeader
        title={category.name}
        subtitle={category.description ?? undefined}
        titleClassName={cormorant.className}
      />
      <ProductGrid products={products} serifClassName={cormorant.className} />
    </div>
  )
}
