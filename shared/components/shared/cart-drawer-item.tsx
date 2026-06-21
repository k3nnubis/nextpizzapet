import React from "react";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import { cn } from "@/shared/lib/utils";

import * as CartItem from "./cart-item-details";
import { CountButton } from "./count-button";
import { Trash2Icon } from "lucide-react";

interface CartDrawerItemProps extends CartItemProps {
  className?: string;
}

export function CartDrawerItem({ imageUrl, name, price, quantity, details, className }: CartDrawerItemProps) {
  return (
    <div className={cn("flex gap-6 bg-white p-5", className)}>
      <CartItem.Image src={imageUrl} />

      <div className="flex-1">
        <CartItem.Info name={name} details={details} />

        <hr className="my-3" />

        <div className="flex items-center justify-between">
          <CountButton onClick={(type) => console.log(type)} value={quantity} />

          <div className="flex items-center gap-3">
            <CartItem.Price value={price} />
            <Trash2Icon className="cursor-pointer text-gray-400 hover:text-gray-600" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
