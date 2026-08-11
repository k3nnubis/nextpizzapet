import React from "react";
import * as CartItemDetails from "./cart-item-details/index";
import { cn } from "@/shared/lib/utils";

interface Props {
  imageUrl: string;
  name: string;
  count: number;
  price: number;
  className?: string;
}

export const OrderCartItem: React.FC<Props> = ({ imageUrl, name, count, price, className }) => {
  return (
    <div className={cn("flex items-center justify-between p-4 px-7", className)}>
      <div className="flex items-center gap-3">
        <CartItemDetails.Image src={imageUrl} />
        <CartItemDetails.Info name={name} />
      </div>
      <div>
        <CartItemDetails.Price value={price} />
        <span className="text-gray-400">{count} шт.</span>
      </div>
    </div>
  );
};
