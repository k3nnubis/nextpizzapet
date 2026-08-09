"use client";

import { Dialog } from "@/shared/components/ui";
import { DialogContent } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProductWithRelations } from "@/@types/prisma";
import { ProductForm } from "../product-form";

interface ChooseProductModalProps {
  product: ProductWithRelations;
  className?: string;
}

export function ChooseProductModal({ product, className }: ChooseProductModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

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
