import { Container, ProductCategoryProducts, ProductForm } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      cart: true,
      orders: true,
    },
  });
  if (!user) return notFound();

  return (
    <div>
      {user.id}
      {user.fullName}
    </div>
  );
}
