"use client";

import { Dialog } from "@/shared/components/ui";
import { DialogContent } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";
import { ChoosePizzaForm } from "../choose-pizza-form";
import { useCartStore } from "@/shared/store";
import toast from "react-hot-toast";
import { ProductForm } from "../product-form";

interface ChooseProductModalProps {
  product: ProductWithRelations;
  className?: string;
}

export function ChooseProductModal({ product, className }: ChooseProductModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const firstItem = product.variants[0];
  const isPizzaForm = Boolean(firstItem.pizzaType);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);

  React.useEffect(() => {
    if (pathname.startsWith("/product/")) {
      setOpen(true);
    }
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      router.push("/" + window.location.search);
    }, 200);
  };

  const onAddCartItem = async (productItemId = firstItem.id, ingredients?: number[]) => {
    const isPizza = Boolean(ingredients);

    try {
      await addCartItem({
        productItemId,
        ...(ingredients && { ingredients }),
      });
      toast.success(isPizza ? "Пицца добавлена в корзину!" : "Товар добавлен в корзину!");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(isPizza ? "Не удалось добавить пиццу в корзину." : "Не удалось добавить товар в корзину.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        className={cn(
          "min-h-[550px] w-[calc(100vw-40px)] overflow-hidden bg-white p-0 sm:max-w-[1060px]",
          className,
        )}
      >
        <ProductForm product={product} closeFunc={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
