"use client";
import {
  CheckoutItem,
  CheckoutItemDetails,
  CheckoutItemSkeleton,
  CheckoutSidebar,
  CheckoutWhiteBlock,
  Container,
  Title,
} from "@/shared/components/shared";
import { Button, Input, Skeleton, Textarea } from "@/shared/components/ui";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { useCart, useCartItemActions } from "@/shared/hooks";
import { getCartItemDetails } from "@/shared/lib";
import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import React from "react";

export default function CheckoutPage() {
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } = useCart();

  const { loadingItemIds, onClickCountButton, onClickRemove } = useCartItemActions(
    updateItemQuantity,
    removeCartItem,
  );

  return (
    <Container className="mt-10">
      <Title text="Оформление заказа" className="mb-8 text-[36px] font-extrabold" />

      <div className="flex gap-10">
        {/* Левая часть */}
        <div className="mb-20 flex flex-1 flex-col gap-10">
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
          <CheckoutWhiteBlock title="2. Персональные данные">
            <div className="grid grid-cols-2 gap-5">
              <Input name="firstName" className="text-base placeholder:text-gray-400" placeholder="Имя" />
              <Input name="lastName" className="text-base placeholder:text-gray-400" placeholder="Фамилия" />
              <Input name="email" className="text-base placeholder:text-gray-400" placeholder="E-Mail" />
              <Input name="phone" className="text-base placeholder:text-gray-400" placeholder="Телефон" />
            </div>
          </CheckoutWhiteBlock>
          <CheckoutWhiteBlock title="3. Адрес доставки">
            <div className="flex flex-col gap-5">
              <Input
                name="adress"
                className="text-base placeholder:text-gray-400"
                placeholder="Адрес доставки"
              />
              <Textarea
                name="order-comment"
                className="text-base placeholder:text-gray-400"
                placeholder="Укажите тут дополнительную информацию для курьера"
                rows={5}
              />
            </div>
          </CheckoutWhiteBlock>
        </div>
        {/* Правая часть */}
        <div className="w-[450px]">
          <CheckoutSidebar totalAmount={totalAmount} loading={loading} />
        </div>
      </div>
    </Container>
  );
}
