import {
  Ingredient,
  Product,
  ProductItem,
} from "@/src/generated/prisma/client";

export type ProductWithRelations = Product & {
  variants: ProductItem[];
  ingredients: Ingredient[];
};
