'use server'

import { prisma } from '@/lib/db'
import { getSessionId, getSessionIdReadOnly } from '@/lib/session'
import { revalidatePath } from 'next/cache'

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  },
} as const

export async function getCart() {
  const sessionId = await getSessionIdReadOnly()

  if (!sessionId) {
    return { id: '', sessionId: '', items: [], createdAt: new Date(), updatedAt: new Date() }
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: cartInclude,
  })

  if (!cart) {
    return { id: '', sessionId, items: [], createdAt: new Date(), updatedAt: new Date() }
  }

  return cart
}

async function getOrCreateCart() {
  const sessionId = await getSessionId()

  let cart = await prisma.cart.findUnique({
    where: { sessionId },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
    })
  }

  return cart
}

export async function addToCart(variantId: string, quantity: number) {
  try {
    if (quantity <= 0 || quantity > 10) {
      throw new Error("Cantidad inválida")
    }

    const variant = await prisma.variant.findUnique({ where: { id: variantId } })
    if (!variant || variant.stock < quantity) {
      throw new Error("Stock insuficiente")
    }

    const cart = await getOrCreateCart()

    await prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    })

    revalidatePath('/')
  } catch (error) {
    console.error('Cart action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      // Ownership check before delete
      const sessionId = await getSessionIdReadOnly()
      if (!sessionId) throw new Error("Sesión no encontrada")
      const cartItem = await prisma.cartItem.findFirst({
        where: { id: cartItemId, cart: { sessionId } }
      })
      if (!cartItem) throw new Error("Item no encontrado")

      await prisma.cartItem.delete({
        where: { id: cartItemId },
      })
    } else {
      // Ownership check before update
      const sessionId = await getSessionIdReadOnly()
      if (!sessionId) throw new Error("Sesión no encontrada")
      const cartItem = await prisma.cartItem.findFirst({
        where: { id: cartItemId, cart: { sessionId } }
      })
      if (!cartItem) throw new Error("Item no encontrado")

      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      })
    }

    revalidatePath('/')
  } catch (error) {
    console.error('Cart action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const sessionId = await getSessionIdReadOnly()
    if (!sessionId) throw new Error("Sesión no encontrada")
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { sessionId } }
    })
    if (!cartItem) throw new Error("Item no encontrado")

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

    revalidatePath('/')
  } catch (error) {
    console.error('Cart action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}

export async function getCartCount() {
  const sessionId = await getSessionIdReadOnly()

  if (!sessionId) return 0

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })

  if (!cart) return 0

  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

export async function clearCart() {
  try {
    const sessionId = await getSessionIdReadOnly()
    if (!sessionId) return
    const cart = await prisma.cart.findUnique({ where: { sessionId } })
    if (!cart) return
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    revalidatePath('/')
  } catch (error) {
    console.error('Cart action error:', error)
    throw new Error("Ocurrió un error, intenta de nuevo")
  }
}
