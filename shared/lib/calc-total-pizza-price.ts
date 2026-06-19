import { pizzaSize, pizzaType } from "../constants/pizza";
import { Ingredient, ProductItem } from "@/src/generated/prisma/client";

/**
 * Функция для подсчета общей стоимости пиццы
 *
 * @param variants - варианты
 * @param ingredients - ингредиенты
 * @param selectedIngredients - выбранные ингредиенты
 * @param size - размер пиццы
 * @param type - тип теста пиццы
 * @returns number общую стоимость
 */

export const calcTotalPizzaPrice = (
  variants: ProductItem[],
  ingredients: Ingredient[],
  selectedIngredients: Set<number>,
  size: pizzaSize,
  type: pizzaType,
) => {
  const pizzaPrice = variants.find((variant) => variant.pizzaType === type && variant.size === size)?.price || 0;
  const totalIngredientsPrice = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingredient) => acc + ingredient.price, 0);

  return pizzaPrice + totalIngredientsPrice;
};
