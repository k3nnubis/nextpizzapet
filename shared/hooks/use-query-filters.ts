import React from "react";
import { Filters } from "./use-filters";
import qs from "qs";
import { useRouter, useSearchParams } from "next/navigation";

export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prices, pizzaTypes, sizes, selectedIngredients } = filters;

  React.useEffect(() => {
    const params = {
      ...prices,
      pizzaTypes: Array.from(pizzaTypes),
      sizes: Array.from(sizes),
      ingredients: Array.from(selectedIngredients),
    };

    const queryString = qs.stringify(params, {
      arrayFormat: "comma",
    });

    if (queryString === searchParams.toString()) {
      return;
    }

    router.replace(`?${queryString}`, { scroll: false });
  }, [prices, pizzaTypes, sizes, selectedIngredients, searchParams]);
};
