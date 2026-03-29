'use server'

import { prisma } from '@/lib/db'
// Using inline types to avoid Prisma client import issues on Vercel

export async function getProducts(filters?: {
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}) {
  const where: Record<string, any> = { active: true }

  if (filters?.categorySlug) {
    where.category = { slug: filters.categorySlug }
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {}
    if (filters?.minPrice !== undefined) {
      where.price.gte = filters.minPrice
    }
    if (filters?.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice
    }
  }

  let orderBy: Record<string, any> = { createdAt: 'desc' }

  switch (filters?.sortBy) {
    case 'price_asc':
      orderBy = { price: 'asc' }
      break
    case 'price_desc':
      orderBy = { price: 'desc' }
      break
    case 'name_asc':
      orderBy = { name: 'asc' }
      break
    case 'name_desc':
      orderBy = { name: 'desc' }
      break
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
  }

  return prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      variants: true,
    },
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
    },
  })
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: {
      category: true,
    },
  })
}

export async function getProductsByCategory(categorySlug: string) {
  return prisma.product.findMany({
    where: {
      active: true,
      category: { slug: categorySlug },
    },
    include: {
      category: true,
      variants: true,
    },
  })
}
