import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      category: {
        include: {
          products: {
            include: {
              ingredients: true,
              variants: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(product.category);
}
