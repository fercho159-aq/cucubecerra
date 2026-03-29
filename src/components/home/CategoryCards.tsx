import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

interface CategoryCardsProps {
  categories: Category[]
  serifClassName?: string
}

const categoryImages: Record<string, string> = {
  ropones: '/images/category-ropones-nina.png',
  bombachos: '/images/category-bombachos-nino.png',
  accesorios: '/images/detail-pearl-applique-macro.png',
}

function getCategoryImage(slug: string): string | null {
  for (const [key, src] of Object.entries(categoryImages)) {
    if (slug.toLowerCase().includes(key)) return src
  }
  return null
}

export default function CategoryCards({ categories, serifClassName = '' }: CategoryCardsProps) {
  const displayCategories = categories.slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayCategories.map((cat) => {
          const imageSrc = getCategoryImage(cat.slug)
          return (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-all duration-300 hover:border-gold/40 hover:shadow-md"
            >
              <div className="relative aspect-[4/5] w-full bg-beige">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={`Categoria ${cat.name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold">
                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h3 className={`${serifClassName} text-xl font-semibold text-charcoal group-hover:text-gold transition-colors`}>
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-2 text-sm text-gray-warm line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <span className="mt-4 inline-block text-sm font-medium text-gold group-hover:text-gold-dark transition-colors">
                  Ver productos
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
