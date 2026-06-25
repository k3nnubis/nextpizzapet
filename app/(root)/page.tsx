import { Container, Filters, ProductsGroupList, Title, TopBar } from "@/shared/components/shared";
import { Suspense } from "react";
import { findProducts, GetSearchParams } from "@/shared/lib/find-products";

export default async function Home({ searchParams }: { searchParams: Promise<GetSearchParams> }) {
  const params = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined) as [string, string][],
  ).toString();
  const categories = await findProducts(params);
  return (
    <>
      <Container className="mt-10">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />
      </Container>
      <TopBar categories={categories.filter((category) => category.products.length > 0)} />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* Фильтрация */}
          <div className="w-[250px]">
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (category) =>
                  category.products.length > 0 && (
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                      queryString={queryString}
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}



