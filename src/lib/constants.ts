export const SHIPPING_COST = 199 // MXN
export const FREE_SHIPPING_THRESHOLD = 2500 // MXN — free shipping above this amount

// Order status constants (matching Prisma OrderStatus enum)
export const ORDER_STATUS = {
  pending: 'pending',
  confirmed: 'confirmed',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded',
} as const

// Payment status constants (matching Prisma PaymentStatus enum)
export const PAYMENT_STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  cancelled: 'cancelled',
  refunded: 'refunded',
} as const
