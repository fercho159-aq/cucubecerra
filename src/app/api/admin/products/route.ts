import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      variants: { select: { stock: true } },
    },
  })

  return NextResponse.json(products)
}
