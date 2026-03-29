'use server'

import { prisma } from '@/lib/db'

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  return category
}
