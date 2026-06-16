"use client";

import { Dialog } from "@/components/ui";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChooseProductForm } from "../choose-product-form";

interface ChooseProductModalProps {
  product: Product;
  className?: string;
}

export function ChooseProductModal({
  product,
  className,
}: ChooseProductModalProps) {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "min-h-[500px] w-[calc(100vw-40px)] bg-white p-0 sm:max-w-[1060px]",
          className,
        )}
      >
        <ChooseProductForm
          imageUrl={product.imageUrl}
          name={product.name}
          ingredients={[]}
        />
      </DialogContent>
    </Dialog>
  );
}
