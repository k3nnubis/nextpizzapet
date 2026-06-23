"use client";
import React from "react";
import { Button, Skeleton } from "../ui";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CartDrawer } from "./cart-drawer";
import { useCartStore } from "@/shared/store";

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  const totalAmmount = useCartStore((state) => state.totalAmount);
  const loading = useCartStore((state) => state.loading);
  const items = useCartStore((state) => state.items);

  return (
    <CartDrawer>
      <Button disabled={loading} className={cn("group relative min-w-[118px]", className)}>
        <b>{loading ? <Skeleton className="h-4 w-12 rounded-sm bg-white/40" /> : `${totalAmmount} ₽`}</b>
        <span className="2xl: mx-2 h-full w-[1px] bg-white/30" />
        <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
          <ShoppingCart className="relative h-4 w-4" strokeWidth={2} />
          <b>{loading ? <Skeleton className="h-4 w-4 rounded-sm bg-white/40" /> : items.length}</b>
        </div>
        <ArrowRight className="absolute right-5 w-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </Button>
    </CartDrawer>
  );
}
