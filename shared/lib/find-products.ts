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

export const findProducts = async (params: GetSearchParams) => {
  const pizzaSizes = params.sizes?.split(",").map(Number);
  const pizzaTypes = params.pizzaTypes?.split(",").map(Number);
  const ingredientsIdArr = params.ingredients?.split(",").map(Number);

  const minPrice = params.priceFrom ? Number(params.priceFrom) : DEFAULT_MIN_PRICE;
  const maxPrice = params.priceTo ? Number(params.priceTo) : DEFAULT_MAX_PRICE;
  const hasPriceFilter = params.priceFrom || params.priceTo;

  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: "desc",
        },
        where: {
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
  });

  return categories;
};
