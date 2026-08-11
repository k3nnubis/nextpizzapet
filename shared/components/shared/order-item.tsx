"use client";

import { cn } from "@/shared/lib/utils";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import React from "react";
import { Title } from "./title";
import { ChevronDown } from "lucide-react";
import { OrderCartItem } from "./order-cart-item";
import { OrderStatus } from "./order-status";
import { OrderStatus as IOrderStatus } from "@/src/generated/prisma/enums";

interface Props {
  id: number;
  items: CartItemDTO[];
  expanded?: boolean;
  createdAt: string;
  totalAmount: number;
  status: IOrderStatus;
  className?: string;
}

const ITEM_HEIGHT = 98;
const FOOTER_HEIGHT = 68;

export const OrderItem: React.FC<Props> = ({
  id = 0,
  items,
  totalAmount = 0,
  createdAt,
  expanded = false,
  status,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  const TOTAL_HEIGHT = isExpanded ? items.length * ITEM_HEIGHT + FOOTER_HEIGHT : 0;

  return (
    <div className={cn("rounded-3xl bg-white select-none", className)}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-7"
      >
        <div className="flex items-center gap-6">
          <Title text={`Заказ #${id}`} size="md" className="font-extrabold" />
          <span className="text-gray-400">{createdAt}</span>
        </div>
        <div className="flex items-center gap-5">
          <OrderStatus variant={status} />
          <ChevronDown className={cn(isExpanded ? "-rotate-180" : "", "transition-all")} />
        </div>
      </div>

      <div
        className={cn("overflow-hidden transition-all duration-600", "ease-(--order-item-ease)")}
        style={{ height: TOTAL_HEIGHT }}
      >
        <div>
          {items.map((item) => (
            <OrderCartItem
              key={item.id}
              imageUrl={item.productItem.product.imageUrl}
              name={item.productItem.product.name}
              count={item.quantity}
              price={item.productItem.price * item.quantity}
              className="border-b border-gray-100"
            />
          ))}

          <div className="p-5 px-7">
            <h3 className="text-xl">
              Итого: <b>{totalAmount} ₽</b>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
