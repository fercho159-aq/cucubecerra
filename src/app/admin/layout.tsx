'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▣' },
  { href: '/admin/productos', label: 'Productos', icon: '◈' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '◉' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Cucú Becerra</h2>
          <p className="text-xs text-gray-400">Panel de administración</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
