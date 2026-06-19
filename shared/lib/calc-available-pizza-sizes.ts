import { pizzaSizes, type pizzaType } from "@/shared/constants/pizza";
import { ProductItem } from "@/src/generated/prisma/client";
import { Variant } from "../components/shared/variants-selector";

export const calcAvailablePizzaSizes = (variants: ProductItem[], type: pizzaType): Variant[] => {
  const filteredPizzasByType = variants.filter((variant) => variant.pizzaType === type);

  return pizzaSizes.map((pizzaSize) => ({
    name: pizzaSize.name,
    value: pizzaSize.value,
    disabled: !filteredPizzasByType.some((availablePizza) => availablePizza.size === Number(pizzaSize.value)),
  }));
};
