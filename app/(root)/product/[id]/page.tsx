import {
  Container,
  PizzaImage,
  Title,
  VariantsSelector,
} from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) return notFound();

  return (
    <Container className="my-10 flex flex-col">
      <div className="flex flex-1">
        <PizzaImage
          imageUrl={product.imageUrl}
          size={40}
          productName={product.name}
        />
        <div className="w-[490px] bg-[#fcf7f7] p-7">
          <Title
            text={product.name}
            size="md"
            className="mb-1 font-extrabold"
          />
          <p className="text-gray-400">Какое то описание пиццешечки</p>
          <VariantsSelector
            selectedValue="2"
            items={[
              {
                name: "Маленькая",
                value: "1",
              },
              {
                name: "Средняя",
                value: "2",
              },
              {
                name: "Большая",
                value: "3",
                disabled: true,
              },
            ]}
          />
        </div>
      </div>
    </Container>
  );
}
