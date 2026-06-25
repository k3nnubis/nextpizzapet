"use client";

import { ProductWithRelations } from "@/@types/prisma";
import { useCartStore } from "@/shared/store";
import React from "react";
import toast from "react-hot-toast";
import { ChoosePizzaForm } from "./choose-pizza-form";
import { ChooseProductForm } from "./choose-product-form";

interface ProductFormProps {
  closeFunc?: VoidFunction;
  product: ProductWithRelations;
  className?: string;
}

export function ProductForm({ product, closeFunc, className }: ProductFormProps) {
  const firstItem = product.variants[0];
  const isPizzaForm = Boolean(firstItem.pizzaType);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);
  const onAddCartItem = async (productItemId = firstItem.id, ingredients?: number[]) => {
    const isPizza = Boolean(ingredients);

    try {
      await addCartItem({
        productItemId,
        ...(ingredients && { ingredients }),
      });
      toast.success(isPizza ? "Пицца добавлена в корзину!" : "Товар добавлен в корзину!");
      closeFunc?.();
    } catch (error) {
      console.error(error);
      toast.error(isPizza ? "Не удалось добавить пиццу в корзину." : "Не удалось добавить товар в корзину.");
    }
  };
  if (isPizzaForm) {
    return (
      <ChoosePizzaForm
        name={product.name}
        imageUrl={product.imageUrl}
        ingredients={product.ingredients}
        variants={product.variants}
        onSubmit={onAddCartItem}
        loading={loading}
      />
    );
  }
  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      onSubmit={onAddCartItem}
      price={firstItem.price}
      loading={loading}
    />
  );
}
