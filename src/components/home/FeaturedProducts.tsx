import { getFeaturedProducts } from '@/actions/products'
import ProductGrid from '@/components/product/ProductGrid'
import SectionHeader from '@/components/ui/SectionHeader'

interface FeaturedProductsProps {
  serifClassName?: string
}

export default async function FeaturedProducts({ serifClassName = '' }: FeaturedProductsProps) {
  const products = await getFeaturedProducts()

  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <SectionHeader
        title="Productos Destacados"
        subtitle="Nuestras piezas más solicitadas, confeccionadas con los mejores materiales"
        titleClassName={serifClassName}
      />
      <ProductGrid products={products} serifClassName={serifClassName} />
    </section>
  )
}
