-- CreateEnum
CREATE TYPE "public"."ProductType" AS ENUM ('SIMPLE', 'PIZZA');

-- AlterTable
ALTER TABLE "public"."Product"
ADD COLUMN "type" "public"."ProductType" NOT NULL DEFAULT 'SIMPLE';

-- Backfill the existing pizzas before relying on the explicit product type.
UPDATE "public"."Product" AS product
SET "type" = 'PIZZA'
WHERE EXISTS (
  SELECT 1
  FROM "public"."ProductItem" AS variant
  WHERE variant."productId" = product."id"
    AND (variant."pizzaType" IS NOT NULL OR variant."size" IS NOT NULL)
);

-- A pizza can contain each dough-and-size combination only once.
CREATE UNIQUE INDEX "ProductItem_productId_pizzaType_size_key"
ON "public"."ProductItem"("productId", "pizzaType", "size");
