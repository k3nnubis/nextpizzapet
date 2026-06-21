import React from "react";
import { Button } from "../ui";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CartDrawer } from "./cart-drawer";

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  return (
    <CartDrawer>
      <Button className={cn("group relative", className)}>
        <b>520р</b>
        <span className="2xl: mx-2 h-full w-[1px] bg-white/30" />
        <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
          <ShoppingCart className="relative h-4 w-4" strokeWidth={2} />
          <b>3</b>
        </div>
        <ArrowRight className="absolute right-5 w-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </Button>
    </CartDrawer>
  );
}
