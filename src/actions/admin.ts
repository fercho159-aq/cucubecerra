'use server'

import { prisma } from '@/lib/db'
import { ORDER_STATUS } from '@/lib/constants'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { OrderStatus, PaymentStatus } from '@prisma/client'

export async function getOrders(filters?: { status?: string; page?: number }) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("No autorizado")

  try {
    const page = filters?.page ?? 1
    const perPage = 20
    const skip = (page - 1) * perPage

    const where = filters?.status ? { status: filters.status as OrderStatus } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
        include: {
          _count: {
            select: { items: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return {
      orders,
      total,
      pages: Math.ceil(total / perPage),
      page,
    }
  } catch (error) {
    console.error('Admin action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("No autorizado")

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    })

    revalidatePath('/')
    return order
  } catch (error) {
    console.error('Admin action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function createProduct(data: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("No autorizado")

  try {
    const name = data.get('name') as string
    const slug = data.get('slug') as string
    const sku = data.get('sku') as string
    const description = data.get('description') as string
    const price = parseFloat(data.get('price') as string)
    const categoryId = data.get('categoryId') as string
    const featured = data.get('featured') === 'true'
    const images = data.getAll('images') as string[]
    const tags = data.getAll('tags') as string[]
    const variantsJson = data.get('variants') as string
    const variants = variantsJson ? JSON.parse(variantsJson) : []

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description,
        price,
        categoryId,
        featured,
        images,
        tags,
        variants: {
          create: variants.map((v: { size: string; color?: string; stock?: number }) => ({
            size: v.size,
            color: v.color ?? null,
            stock: v.stock ?? 10,
          })),
        },
      },
      include: {
        variants: true,
        category: true,
      },
    })

    revalidatePath('/')
    return product
  } catch (error) {
    console.error('Admin action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function updateProduct(id: string, data: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("No autorizado")

  try {
    const name = data.get('name') as string
    const slug = data.get('slug') as string
    const sku = data.get('sku') as string
    const description = data.get('description') as string
    const price = parseFloat(data.get('price') as string)
    const categoryId = data.get('categoryId') as string
    const featured = data.get('featured') === 'true'
    const images = data.getAll('images') as string[]
    const tags = data.getAll('tags') as string[]
    const variantsJson = data.get('variants') as string
    const variants = variantsJson ? JSON.parse(variantsJson) : []

    const product = await prisma.$transaction(async (tx: any) => {
      // Don't delete variants that have existing orders — set stock to 0 instead
      const variantsWithOrders = await tx.variant.findMany({
        where: { productId: id, orderItems: { some: {} } },
        select: { id: true }
      })
      const variantIdsWithOrders = variantsWithOrders.map((v: { id: string }) => v.id)

      // Only delete variants WITHOUT orders
      await tx.variant.deleteMany({
        where: { productId: id, id: { notIn: variantIdsWithOrders } }
      })

      // Mark variants with orders as stock 0
      if (variantIdsWithOrders.length > 0) {
        await tx.variant.updateMany({
          where: { id: { in: variantIdsWithOrders } },
          data: { stock: 0 }
        })
      }

      // Update product with new variants
      return tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          sku,
          description,
          price,
          categoryId,
          featured,
          images,
          tags,
          variants: {
            create: variants.map((v: { size: string; color?: string; stock?: number }) => ({
              size: v.size,
              color: v.color ?? null,
              stock: v.stock ?? 10,
            })),
          },
        },
        include: {
          variants: true,
          category: true,
        },
      })
    })

    revalidatePath('/')
    return product
  } catch (error) {
    console.error('Admin action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("No autorizado")

  try {
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/')
  } catch (error) {
    console.error('Admin action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function getDashboardStats() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("No autorizado")

  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfDay)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      ordersToday,
      ordersWeek,
      ordersMonth,
      revenueTodayResult,
      revenueWeekResult,
      revenueMonthResult,
      pendingOrders,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfWeek } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { status: ORDER_STATUS.pending as OrderStatus },
      }),
    ])

    return {
      ordersToday,
      ordersWeek,
      ordersMonth,
      revenueToday: Number(revenueTodayResult._sum.total ?? 0),
      revenueWeek: Number(revenueWeekResult._sum.total ?? 0),
      revenueMonth: Number(revenueMonthResult._sum.total ?? 0),
      pendingOrders,
    }
  } catch (error) {
    console.error('Admin action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}
