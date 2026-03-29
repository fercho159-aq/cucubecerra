'use server'

import { prisma } from '@/lib/db'
import { getSessionId } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

export async function createOrder(data: {
  cartId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  notes?: string
}) {
  try {
    const sessionId = await getSessionId()

    const cart = await prisma.cart.findFirst({
      where: { id: data.cartId, sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('El carrito está vacío')
    }

    const order = await prisma.$transaction(async (tx: any) => {
      // Generate sequential order number
      const lastOrder = await tx.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { orderNumber: true },
      })

      let nextNumber = 1
      if (lastOrder) {
        const lastNum = parseInt(lastOrder.orderNumber.replace('CB-', ''), 10)
        nextNumber = lastNum + 1
      }
      const orderNumber = `CB-${nextNumber.toString().padStart(4, '0')}`

      // Calculate subtotal from variant prices (use product price since variants don't have price)
      const subtotal = cart.items.reduce((sum, item) => {
        return sum + Number(item.variant.product.price) * item.quantity
      }, 0)

      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      const total = subtotal + shipping

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          sessionId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          shippingCity: data.shippingCity,
          shippingState: data.shippingState,
          shippingZip: data.shippingZip,
          notes: data.notes,
          subtotal,
          shipping,
          total,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.variant.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      })

      return newOrder
    })

    revalidatePath('/')
    return order
  } catch (error) {
    console.error('Order action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error('Order action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}
