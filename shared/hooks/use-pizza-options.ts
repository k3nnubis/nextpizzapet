import { mapPizzaType, type pizzaSize, type pizzaType, pizzaTypes } from "@/shared/constants/pizza";
import { calcAvailablePizzaSizes } from "@/shared/lib";
import { ProductItem } from "@/src/generated/prisma/client";
import React from "react";
import { useSet } from "react-use";

interface UsePizzaOptionsProps {
  variants: ProductItem[];
}

export function usePizzaOptions({ variants }: UsePizzaOptionsProps) {
  const [size, setSize] = React.useState<pizzaSize>(40);
  const [type, setType] = React.useState<pizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  const availablePizzaSizes = React.useMemo(() => {
    return calcAvailablePizzaSizes(variants, type);
  }, [type, variants]);

  React.useEffect(() => {
    const isAvailableSize = availablePizzaSizes.find(
      (pizzaSize) => pizzaSize.value === String(size) && !pizzaSize.disabled,
    );
    const availableSize = availablePizzaSizes.find((pizzaSize) => !pizzaSize.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as pizzaSize);
    }
  }, [availablePizzaSizes, size]);

  const textDetails = `${size} см, ${mapPizzaType[type]} тесто`;

  const setPizzaSize = (value: string) => {
    setSize(Number(value) as pizzaSize);
  };

  const setPizzaType = (value: string) => {
    setType(Number(value) as pizzaType);
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
  };
}
