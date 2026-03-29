import type { Decimal } from '@prisma/client/runtime/client'

export interface CategoryData {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  gender: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProductData {
  id: string
  sku: string
  name: string
  slug: string
  description: string
  price: Decimal | string | number
  images: string[]
  categoryId: string
  tags: string[]
  featured: boolean
  active: boolean
  createdAt: Date
  updatedAt: Date
  category?: CategoryData
  variants?: VariantData[]
}

export interface VariantData {
  id: string
  productId: string
  size: string
  color: string | null
  stock: number
  active: boolean
  product?: ProductData
}

export interface CartItemData {
  id: string
  cartId: string
  variantId: string
  quantity: number
  variant: VariantData & {
    product: ProductData
  }
}

export interface CartData {
  id: string
  sessionId: string
  items: CartItemData[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItemData {
  id: string
  orderId: string
  variantId: string
  quantity: number
  unitPrice: Decimal | string | number
  variant: VariantData & {
    product: ProductData
  }
}

export interface OrderData {
  id: string
  orderNumber: string
  status: string
  items: OrderItemData[]
  subtotal: Decimal | string | number
  shipping: Decimal | string | number
  total: Decimal | string | number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  paymentMethod: string
  paymentId: string | null
  paymentStatus: string
  sessionId: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

/** Minimal variant shape used in sitemap and simple queries */
export interface SitemapProduct {
  slug: string
  updatedAt: Date
}

export interface SitemapCategory {
  slug: string
  updatedAt: Date
}

/** Simple order item without variant relation (e.g. from webhook query) */
export interface SimpleOrderItem {
  id: string
  orderId: string
  variantId: string
  quantity: number
  unitPrice: Decimal | string | number
}
