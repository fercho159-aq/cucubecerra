'use client'

import { useEffect, useState } from 'react'
const OS = {
  pending: 'pending',
  confirmed: 'confirmed',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded',
} as const
import { getDashboardStats, getOrders } from '@/actions/admin'
import Link from 'next/link'

type Stats = {
  ordersToday: number
  ordersWeek: number
  ordersMonth: number
  revenueToday: number
  revenueWeek: number
  revenueMonth: number
  pendingOrders: number
}

type OrderRow = {
  id: string
  orderNumber: string
  customerName: string
  total: number | string
  status: string
  paymentStatus: string
  createdAt: string
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
  })
}

const statusLabels: Record<string, string> = {
  [OS.pending]: 'Pendiente',
  [OS.confirmed]: 'Confirmado',
  [OS.shipped]: 'Enviado',
  [OS.delivered]: 'Entregado',
  [OS.cancelled]: 'Cancelado',
  [OS.refunded]: 'Reembolsado',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getOrders({ page: 1 }),
        ])
        setStats(statsData)
        setRecentOrders(
          (ordersData.orders as unknown as OrderRow[]).slice(0, 10)
        )
      } catch (e) {
        console.error('Error loading dashboard:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-500">Pedidos hoy</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              {stats.ordersToday}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Ingresos: {formatPrice(stats.revenueToday)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-500">Pedidos esta semana</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              {stats.ordersWeek}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Ingresos: {formatPrice(stats.revenueWeek)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-500">Pedidos este mes</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              {stats.ordersMonth}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Ingresos: {formatPrice(stats.revenueMonth)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-500">Pedidos pendientes</p>
            <p className="text-2xl font-semibold text-orange-600 mt-1">
              {stats.pendingOrders}
            </p>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/productos"
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 transition-colors"
        >
          Gestionar productos
        </Link>
        <Link
          href="/admin/pedidos"
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 transition-colors"
        >
          Ver todos los pedidos
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            Pedidos recientes
          </h2>
        </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {order.customerName}
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
                              : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {order.paymentStatus}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-gray-400"
                  >
                    No hay pedidos aún
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
