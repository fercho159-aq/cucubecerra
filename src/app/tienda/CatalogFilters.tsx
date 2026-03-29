'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

interface CatalogFiltersProps {
  categories: Category[]
  currentCategory?: string
  currentSort?: string
}

const sortOptions = [
  { value: '', label: 'Mas recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre: A-Z' },
  { value: 'name_desc', label: 'Nombre: Z-A' },
]

export default function CatalogFilters({
  categories,
  currentCategory,
  currentSort,
}: CatalogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/tienda?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      {/* Sort (mobile-friendly) */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Ordenar por
        </label>
        <select
          value={currentSort ?? ''}
          onChange={(e) => updateFilter('orden', e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-charcoal focus:border-gold focus:ring-1 focus:ring-gold outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category filter */}
      <div>
        <h3 className="text-sm font-medium text-charcoal mb-3">Categorias</h3>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => updateFilter('categoria', '')}
              className={`text-sm transition-colors ${
                !currentCategory
                  ? 'text-gold font-medium'
                  : 'text-gray-warm hover:text-charcoal'
              }`}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => updateFilter('categoria', cat.slug)}
                className={`text-sm transition-colors ${
                  currentCategory === cat.slug
                    ? 'text-gold font-medium'
                    : 'text-gray-warm hover:text-charcoal'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
