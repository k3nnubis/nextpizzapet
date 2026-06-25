"use client";

import React from "react";
import { useProductCategory } from "@/shared/hooks/use-product-category";
import { ProductsGroupList } from "./products-group-list";

interface Props {
  productId: number;
}

export const ProductCategoryProducts: React.FC<Props> = ({ productId }) => {
  const { category, loading } = useProductCategory(productId);
  const products = category?.products.filter((product) => product.id !== productId);

  if (loading || !category || !products?.length) {
    return null;
  }

  return (
    <ProductsGroupList title="Рекомендации" categoryId={category.id} items={products} className="mt-16" />
  );
};
