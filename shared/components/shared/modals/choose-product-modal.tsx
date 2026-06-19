"use client";

import { Dialog } from "@/shared/components/ui";
import { DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import React from "react";
import { useRouter } from "next/navigation";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";
import { ChoosePizzaForm } from "../choose-pizza-form";

interface ChooseProductModalProps {
  product: ProductWithRelations;
  className?: string;
}

export function ChooseProductModal({
  product,
  className,
}: ChooseProductModalProps) {
  const router = useRouter();
  const isPizzaForm = Boolean(product.variants[0].pizzaType);

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "min-h-[550px] w-[calc(100vw-40px)] overflow-hidden bg-white p-0 sm:max-w-[1060px]",
          className,
        )}
      >
        {isPizzaForm ? (
          <ChoosePizzaForm
            name={product.name}
            imageUrl={product.imageUrl}
            ingredients={product.ingredients}
            variants={product.variants}
          />
        ) : (
          <ChooseProductForm imageUrl={product.imageUrl} name={product.name} />
        )}
      </DialogContent>
    </Dialog>
  );
}
