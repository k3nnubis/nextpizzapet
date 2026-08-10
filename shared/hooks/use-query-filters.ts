import React from "react";
import { Filters } from "./use-filters";
import qs from "qs";
import { useRouter, useSearchParams } from "next/navigation";

export const useQueryFilters = (filters: Filters) => {
  const isMounted = React.useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prices, pizzaTypes, sizes, selectedIngredients } = filters;

  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        ...prices,
        pizzaTypes: Array.from(pizzaTypes),
        sizes: Array.from(sizes),
        ingredients: Array.from(selectedIngredients),
        sortBy: searchParams.get("sortBy") || undefined,
      };

      const queryString = qs.stringify(params, {
        arrayFormat: "comma",
      });

      if (queryString === searchParams.toString()) {
        return;
      }

      router.replace(`?${queryString}`, { scroll: false });
    }

    isMounted.current = true;
  }, [prices, pizzaTypes, sizes, selectedIngredients, searchParams, router]);
};
