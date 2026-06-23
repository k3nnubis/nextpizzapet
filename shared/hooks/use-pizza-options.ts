import { mapPizzaType, type PizzaSize, type PizzaType, pizzaTypes } from "@/shared/constants/pizza";
import { calcAvailablePizzaSizes } from "@/shared/lib";
import { ProductItem } from "@/src/generated/prisma/client";
import React from "react";
import { useSet } from "react-use";

interface UsePizzaOptionsProps {
  variants: ProductItem[];
}

export function usePizzaOptions({ variants }: UsePizzaOptionsProps) {
  const [size, setSize] = React.useState<PizzaSize>(40);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  const currentItemId = variants.find((variant) => variant.pizzaType === type && variant.size === size)?.id;

  const availablePizzaSizes = React.useMemo(() => {
    return calcAvailablePizzaSizes(variants, type);
  }, [type, variants]);

  React.useEffect(() => {
    const isAvailableSize = availablePizzaSizes.find(
      (pizzaSize) => pizzaSize.value === String(size) && !pizzaSize.disabled,
    );
    const availableSize = availablePizzaSizes.find((pizzaSize) => !pizzaSize.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as PizzaSize);
    }
  }, [availablePizzaSizes, size]);

  const textDetails = `${size} см, ${mapPizzaType[type]} тесто`;

  const setPizzaSize = (value: string) => {
    setSize(Number(value) as PizzaSize);
  };

  const setPizzaType = (value: string) => {
    setType(Number(value) as PizzaType);
  };

  return {
    size,
    type,
    pizzaTypes,
    textDetails,
    addIngredient,
    setPizzaSize,
    setPizzaType,
    selectedIngredients,
    availablePizzaSizes,
    currentItemId,
  };
}
