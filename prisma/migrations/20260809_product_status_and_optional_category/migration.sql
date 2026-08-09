-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "public"."Product"
ADD COLUMN "status" "public"."ProductStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "categoryId" DROP NOT NULL;

-- Make removing a category preserve its products as uncategorized drafts.
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";
ALTER TABLE "public"."Product"
ADD CONSTRAINT "Product_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
