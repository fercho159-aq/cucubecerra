'use client'

import { useEffect, useState } from 'react'
// String constants matching the OrderStatus enum (can't import Prisma in client components)
const OS = {
  pending: 'pending',
  confirmed: 'confirmed',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded',
} as const
import { getOrders, updateOrderStatus } from '@/actions/admin'

type OrderRow = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number | string
  status: string
  paymentStatus: string
  createdAt: string
  _count: { items: number }
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: OS.pending, label: 'Pendiente' },
  { value: OS.confirmed, label: 'Confirmado' },
  { value: OS.shipped, label: 'Enviado' },
  { value: OS.delivered, label: 'Entregado' },
  { value: OS.cancelled, label: 'Cancelado' },
  { value: OS.refunded, label: 'Reembolsado' },
]

const statusLabels: Record<string, string> = {
  [OS.pending]: 'Pendiente',
  [OS.confirmed]: 'Confirmado',
  [OS.shipped]: 'Enviado',
  [OS.delivered]: 'Entregado',
  [OS.cancelled]: 'Cancelado',
  [OS.refunded]: 'Reembolsado',
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function loadOrders() {
    setLoading(true)
    try {
      const data = await getOrders({
        status: (statusFilter as string) || undefined,
        page,
      })
      setOrders(data.orders as unknown as OrderRow[])
      setTotalPages(data.pages)
    } catch (e) {
      console.error('Error loading orders:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter, page])

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      )
    } catch (e) {
      console.error('Error updating status:', e)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pedidos</h1>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Orden</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Pago</th>
                <th className="px-5 py-3 font-medium">Cambiar estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-gray-400"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-gray-400"
                  >
                    No hay pedidos
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-gray-800">{order.customerName}</div>
                      <div className="text-xs text-gray-400">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-gray-800">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          order.status === OS.confirmed
                            ? 'bg-green-100 text-green-700'
                            : order.status === OS.pending
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === OS.cancelled || order.status === OS.refunded
                                ? 'bg-red-100 text-red-700'
                                : order.status === OS.shipped
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {order.paymentStatus}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as string)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                      >
                        {statusOptions
                          .filter((o) => o.value !== '')
                          .map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
