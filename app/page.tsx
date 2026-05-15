import {
  Container,
  Filters,
  ProductCard,
  ProductsGroupList,
  Title,
  TopBar,
} from "@/components/shared";

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />
      </Container>
      <TopBar />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* Фильтрация */}
          <div className="w-[250px]">
            <Filters />
          </div>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductsGroupList
                title="Пиццы"
                items={[
                  {
                    id: 1,
                    name: "Пеперонни фреш",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198bf25089a74d08e08629b41ed39ee.avif",
                    price: 239,
                    items: [{ price: 239 }],
                  },
                  {
                    id: 2,
                    name: "Чесночный цыпленок",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198bf24170179679a7872f2ddf16d18.avif",
                    price: 249,
                    items: [{ price: 249 }],
                  },
                  {
                    id: 3,
                    name: "Терияки",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198da9ee2dd75038d9b6f7f23810d42.avif",
                    price: 329,
                    items: [{ price: 329 }],
                  },
                  {
                    id: 4,
                    name: "Чесночный цыпленок",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198bf24170179679a7872f2ddf16d18.avif",
                    price: 249,
                    items: [{ price: 249 }],
                  },
                  {
                    id: 5,
                    name: "Терияки",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198da9ee2dd75038d9b6f7f23810d42.avif",
                    price: 329,
                    items: [{ price: 329 }],
                  },
                ]}
                categoryId={1}
              />
              <ProductsGroupList
                title="Комбо"
                items={[
                  {
                    id: 6,
                    name: "Пеперонни фреш",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198bf25089a74d08e08629b41ed39ee.avif",
                    price: 239,
                    items: [{ price: 239 }],
                  },
                  {
                    id: 7,
                    name: "Чесночный цыпленок",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198bf24170179679a7872f2ddf16d18.avif",
                    price: 249,
                    items: [{ price: 249 }],
                  },
                  {
                    id: 8,
                    name: "Терияки",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198da9ee2dd75038d9b6f7f23810d42.avif",
                    price: 329,
                    items: [{ price: 329 }],
                  },
                  {
                    id: 9,
                    name: "Чесночный цыпленок",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198bf24170179679a7872f2ddf16d18.avif",
                    price: 249,
                    items: [{ price: 249 }],
                  },
                  {
                    id: 10,
                    name: "Терияки",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:292x292/0198da9ee2dd75038d9b6f7f23810d42.avif",
                    price: 329,
                    items: [{ price: 329 }],
                  },
                ]}
                categoryId={2}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
