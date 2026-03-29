import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Preference } from 'mercadopago'
import { mercadopago } from '@/lib/mercadopago'
import { prisma } from '@/lib/db'
import type { OrderItemData } from '@/types'

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId es requerido' },
        { status: 400 }
      )
    }

    // Verify session ownership
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart_session')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Verify session owns this order
    if (order.sessionId && order.sessionId !== sessionId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const preference = new Preference(mercadopago)

    const result = await preference.create({
      body: {
        items: [
          ...order.items.map((item: OrderItemData) => ({
            id: item.id,
            title: item.variant.product.name,
            quantity: item.quantity,
            unit_price: Number(item.unitPrice),
            currency_id: 'MXN',
          })),
          ...(Number(order.shipping) > 0
            ? [{
                id: 'shipping',
                title: 'Envio',
                quantity: 1,
                unit_price: Number(order.shipping),
                currency_id: 'MXN',
              }]
            : []),
        ],
        payer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: {
            number: order.customerPhone,
          },
        },
        back_urls: {
          success: `${baseUrl}/checkout/confirmacion`,
          failure: `${baseUrl}/checkout/error`,
          pending: `${baseUrl}/checkout/pendiente`,
        },
        auto_return: 'approved',
        external_reference: order.orderNumber,
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    })

    return NextResponse.json({
      init_point: result.init_point,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error)
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    )
  }
}
