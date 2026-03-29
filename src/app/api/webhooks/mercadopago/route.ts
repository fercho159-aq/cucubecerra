import { NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mercadopago } from '@/lib/mercadopago'
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants'
import { prisma } from '@/lib/db'
import type { OrderStatus, PaymentStatus } from '@prisma/client'
import crypto from 'crypto'

function verifyWebhookSignature(request: Request, body: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) {
    console.warn('MERCADOPAGO_WEBHOOK_SECRET not set — skipping verification')
    return true // Allow in development
  }

  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')

  if (!xSignature || !xRequestId) return false

  // Parse x-signature: "ts=<timestamp>,v1=<hash>"
  const parts = Object.fromEntries(
    xSignature.split(',').map(part => {
      const [key, value] = part.split('=')
      return [key.trim(), value.trim()]
    })
  )

  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  // Parse body to get data.id
  const parsedBody = JSON.parse(body)
  const dataId = parsedBody.data?.id || ''

  // Build manifest string per MercadoPago docs
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

  return hmac === v1
}

export async function POST(request: Request) {
  const bodyText = await request.text()

  if (!verifyWebhookSignature(request, bodyText)) {
    console.error('Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const body = JSON.parse(bodyText)

    if (body.type !== 'payment' && body.topic !== 'payment') {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const paymentId = body.data?.id || body.resource?.split('/').pop()
    if (!paymentId) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const payment = new Payment(mercadopago)
    const paymentData = await payment.get({ id: paymentId })

    const externalReference = paymentData.external_reference
    if (!externalReference) {
      console.error('No external_reference in payment:', paymentId)
      return NextResponse.json({ error: 'No external_reference' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: externalReference },
      include: { items: true },
    })

    if (!order) {
      console.error('Order not found:', externalReference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const mpStatus = paymentData.status || 'pending'

    // Map MercadoPago status to order status
    const statusMap: Record<string, { orderStatus: string; paymentStatus: string }> = {
      approved: { orderStatus: ORDER_STATUS.confirmed, paymentStatus: PAYMENT_STATUS.approved },
      rejected: { orderStatus: ORDER_STATUS.cancelled, paymentStatus: PAYMENT_STATUS.rejected },
      cancelled: { orderStatus: ORDER_STATUS.cancelled, paymentStatus: PAYMENT_STATUS.cancelled },
      refunded: { orderStatus: ORDER_STATUS.refunded, paymentStatus: PAYMENT_STATUS.refunded },
      in_process: { orderStatus: order.status, paymentStatus: PAYMENT_STATUS.pending },
      pending: { orderStatus: order.status, paymentStatus: PAYMENT_STATUS.pending },
    }

    const mapped = statusMap[mpStatus] || { orderStatus: order.status, paymentStatus: PAYMENT_STATUS.pending }

    // Use transaction for approved payments (need to decrement stock + update order)
    if (mpStatus === 'approved' && order.status !== ORDER_STATUS.confirmed) {
      await prisma.$transaction(async (tx: any) => {
        // Decrement stock for each order item
        for (const item of order.items) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        }

        // Update order status
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentId: String(paymentId),
            paymentStatus: mapped.paymentStatus as PaymentStatus,
            status: mapped.orderStatus as OrderStatus,
          },
        })

        // Clear cart if order has sessionId
        if (order.sessionId) {
          const cart = await tx.cart.findUnique({
            where: { sessionId: order.sessionId },
          })
          if (cart) {
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
          }
        }
      })
    } else {
      // For non-approved statuses, just update the order
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: String(paymentId),
          paymentStatus: mapped.paymentStatus as PaymentStatus,
          status: mapped.orderStatus as OrderStatus,
        },
      })
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
