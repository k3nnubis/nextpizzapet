import { prisma } from "@/prisma/prisma-client";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  sizes?: string;
  pizzaTypes?: string;
  ingredients?: string;
  priceFrom?: string;
  priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

type ProductSort = "popular" | "newest" | "price-asc" | "price-desc";

interface OrderItemSnapshot {
  quantity?: number;
  productItem?: {
    product?: {
      id?: number;
    };
  };
}

function getSortValue(sortBy?: string): ProductSort {
  if (sortBy === "newest" || sortBy === "price-asc" || sortBy === "price-desc") {
    return sortBy;
  }

  return "popular";
}

function getMinimumPrice(product: { variants: { price: number }[] }) {
  return product.variants.length > 0 ? Math.min(...product.variants.map((variant) => variant.price)) : 0;
}

function getProductSales(orders: { items: unknown }[]) {
  const sales = new Map<number, number>();

  for (const order of orders) {
    try {
      const parsedItems = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
      if (!Array.isArray(parsedItems)) continue;

      for (const item of parsedItems as OrderItemSnapshot[]) {
        const productId = item.productItem?.product?.id;
        if (typeof productId !== "number") continue;

        sales.set(productId, (sales.get(productId) ?? 0) + Math.max(item.quantity ?? 1, 1));
      }
    } catch {
      // Старые или повреждённые снимки заказов не должны ломать каталог.
    }
  }

  return sales;
}

export const findProducts = async (params: GetSearchParams) => {
  const sortBy = getSortValue(params.sortBy);
  const pizzaSizes = params.sizes?.split(",").map(Number);
  const pizzaTypes = params.pizzaTypes?.split(",").map(Number);
  const ingredientsIdArr = params.ingredients?.split(",").map(Number);

  const minPrice = params.priceFrom ? Number(params.priceFrom) : DEFAULT_MIN_PRICE;
  const maxPrice = params.priceTo ? Number(params.priceTo) : DEFAULT_MAX_PRICE;
  const hasPriceFilter = params.priceFrom || params.priceTo;

  const [categories, succeededOrders] = await Promise.all([
    prisma.category.findMany({
      include: {
        products: {
          where: {
            status: "ACTIVE",
            ingredients: ingredientsIdArr
              ? {
                  some: {
                    id: {
                      in: ingredientsIdArr,
                    },
                  },
                }
              : undefined,
            variants:
              pizzaSizes || pizzaTypes || hasPriceFilter
                ? {
                    some: {
                      size: pizzaSizes
                        ? {
                            in: pizzaSizes,
                          }
                        : undefined,
                      pizzaType: pizzaTypes
                        ? {
                            in: pizzaTypes,
                          }
                        : undefined,
                      price: {
                        gte: minPrice,
                        lte: maxPrice,
                      },
                    },
                  }
                : undefined,
          },
          include: {
            ingredients: true,
            variants: {
              where: {
                price: {
                  gte: minPrice,
                  lte: maxPrice,
                },
              },
              orderBy: {
                price: "asc",
              },
            },
          },
        },
      },
    }),
    sortBy === "popular"
      ? prisma.order.findMany({
          where: { status: "SUCCEEDED" },
          select: { items: true },
        })
      : Promise.resolve([]),
  ]);

  const sales = getProductSales(succeededOrders);

  for (const category of categories) {
    category.products.sort((first, second) => {
      if (sortBy === "newest") return second.id - first.id;
      if (sortBy === "price-asc") return getMinimumPrice(first) - getMinimumPrice(second);
      if (sortBy === "price-desc") return getMinimumPrice(second) - getMinimumPrice(first);

      const salesDifference = (sales.get(second.id) ?? 0) - (sales.get(first.id) ?? 0);
      return salesDifference || second.id - first.id;
    });
  }

  return categories;
};
