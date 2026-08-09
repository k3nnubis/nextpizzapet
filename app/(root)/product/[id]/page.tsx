import { Container, ProductCategoryProducts, ProductForm } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id: Number(id), status: "ACTIVE", categoryId: { not: null } },
    include: {
      ingredients: true,
      variants: true,
    },
  });
  if (!product) return notFound();

  return (
    <Container className="my-10 flex flex-col">
      <ProductForm product={product} />
      <ProductCategoryProducts productId={product.id} />
    </Container>
  );
}
