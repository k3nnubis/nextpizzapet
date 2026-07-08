import React from "react";
import { CheckoutWhiteBlock } from "./checkout-white-block";
import { CheckoutItemSkeleton } from "./checkout-item-skeleton";
import { CheckoutItem } from "./checkout-item";
import { getCartItemDetails } from "@/shared/lib";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { CartStateItem } from "@/shared/lib/get-cart-details";

interface CheckoutCartProps {
  items: CartStateItem[];
  loading: boolean;
  loadingItemIds: number[];
  onClickCountButton: (id: number, quantity: number, type: "plus" | "minus") => void;
  onClickRemove: (id: number) => void;
}

export function CheckoutCart({
  items,
  loading,
  loadingItemIds,
  onClickCountButton,
  onClickRemove,
}: CheckoutCartProps) {
  return (
    <CheckoutWhiteBlock title="1. Корзина">
      <div className="flex flex-col gap-5">
        {loading && items.length === 0
          ? [...Array(3)].map((_, index) => <CheckoutItemSkeleton key={index} />)
          : items.map((item) =>
              loadingItemIds.includes(item.id) ? (
                <CheckoutItemSkeleton key={item.id} />
              ) : (
                <CheckoutItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  details={getCartItemDetails(
                    item.ingredients,
                    item.pizzaType as PizzaType,
                    item.pizzaSize as PizzaSize,
                  )}
                  imageUrl={item.imageUrl}
                  price={item.price}
                  quantity={item.quantity}
                  onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                  onClickRemove={() => onClickRemove(item.id)}
                />
              ),
            )}
      </div>
    </CheckoutWhiteBlock>
  );
}
