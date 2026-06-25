"use client";

import type { CategoryWithProducts } from "@/@types/prisma";
import { Api } from "@/shared/services/api-client";
import React from "react";

export const useProductCategory = (productId: number) => {
  const [category, setCategory] = React.useState<CategoryWithProducts | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        const category = await Api.categories.getByProductId(productId);
        setCategory(category);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [productId]);

  return { category, loading };
};
