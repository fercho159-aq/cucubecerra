-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'refunded');

-- Convert status column (handle 'paid' -> 'confirmed')
UPDATE "Order" SET "status" = 'confirmed' WHERE "status" = 'paid';
UPDATE "Order" SET "status" = 'pending' WHERE "status" NOT IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING ("status"::"OrderStatus");
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'pending';

-- Convert paymentStatus column
UPDATE "Order" SET "paymentStatus" = 'pending' WHERE "paymentStatus" NOT IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded');
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus" USING ("paymentStatus"::"PaymentStatus");
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" SET DEFAULT 'pending';

-- Add sessionId
ALTER TABLE "Order" ADD COLUMN "sessionId" TEXT;

-- Add active to Variant
ALTER TABLE "Variant" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- Add indexes
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");
CREATE INDEX "Order_sessionId_idx" ON "Order"("sessionId");
CREATE INDEX "Variant_productId_idx" ON "Variant"("productId");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
