"use client";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import * as CartItemDetails from "./cart-item-details";
import { Trash2Icon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface CartItemPropsLocal extends CartItemProps {
  onClickCountButton?: (type: "plus" | "minus") => void;
  onClickRemove?: () => void;
  className?: string;
}

export function CheckoutItem({
  imageUrl,
  name,
  price,
  quantity,
  details,
  className,
  onClickCountButton,
  onClickRemove,
}: CartItemPropsLocal) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex flex-1 items-center gap-5">
        <CartItemDetails.Image src={imageUrl} />
        <CartItemDetails.Info name={name} details={details} />
      </div>

      <CartItemDetails.Price value={price} />

      <div className="ml-20 flex items-center gap-5">
        <CartItemDetails.CountButton onClick={onClickCountButton} value={quantity} />
        <button onClick={onClickRemove} type="button">
          <Trash2Icon className="cursor-pointer text-gray-400 hover:text-gray-600" size={16} />
        </button>
      </div>
    </div>
  );
}
