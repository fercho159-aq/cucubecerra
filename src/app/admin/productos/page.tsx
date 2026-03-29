'use client'

import { useEffect, useState } from 'react'
import { deleteProduct } from '@/actions/admin'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  sku: string
  price: number | string
  active: boolean
  images: string[]
  category: { name: string }
  variants: { stock: number }[]
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function loadProducts() {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error('Error loading products:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (e) {
      console.error('Error deleting product:', e)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 transition-colors"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Imagen</th>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Precio</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Activo</th>
                <th className="px-5 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.stock,
                  0
                )
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded" />
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{product.sku}</td>
                    <td className="px-5 py-3 text-gray-800">
                      {formatPrice(Number(product.price))}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {product.category.name}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          totalStock > 0
                            ? 'text-green-600'
                            : 'text-red-600 font-medium'
                        }
                      >
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          product.active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-gray-400"
                  >
                    No hay productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
