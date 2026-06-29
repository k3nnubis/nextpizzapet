"use client";

import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";
import { Button, Skeleton } from "../ui";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";
import { useCartStore } from "@/shared/store";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { Title } from "./title";

interface CartDrawerProps {
  className?: string;
  children?: React.ReactNode;
}

export function CartDrawer({ className, children }: CartDrawerProps) {
  const totalAmount = useCartStore((state) => state.totalAmount);
  const items = useCartStore((state) => state.items);
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const loading = useCartStore((state) => state.loading);

  React.useEffect(() => {
    fetchCartItems();
  }, []);

  const onClickCountButton = (id: number, quantity: number, type: "plus" | "minus") => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between bg-[#F4F1EE] pb-0">
        <div className={cn("flex h-full flex-col", !totalAmount && "justify-center")}>
          {totalAmount > 0 && (
            <SheetHeader className="mt-2">
              <SheetTitle>
                В корзине <span className="font-bold">{items.length} товара</span>
              </SheetTitle>
            </SheetHeader>
          )}
          {!totalAmount && (
            <div className="mx-auto flex w-72 flex-col items-center justify-center">
              <Image src="/assets/images/empty-cart.png" alt="Empty cart" width={120} height={120} />
              <Title text="Корзина путая" size="sm" className="my-2 text-center font-bold" />
              <p className="mb-5 text-center text-neutral-500">
                Добавьте хотя бы один товар в корзину, чтобы совершить заказ
              </p>
              <SheetClose asChild>
                <Button className="h-12 w-56 text-base" size="lg">
                  <ArrowLeft className="mr-2 w-5" />
                  Вернуться назад
                </Button>
              </SheetClose>
            </div>
          )}
          {totalAmount > 0 && (
            <>
              <div className="scrollbar mt-5 flex-1 overflow-auto">
                {loading
                  ? [...Array(items.length)].map((_, index) => (
                      <div className="mb-2 flex gap-6 bg-white p-5" key={index}>
                        <Skeleton className="h-[65px] w-[65px] rounded-full" />

                        <div className="flex-1">
                          <Skeleton className="mb-2 h-5 w-2/3" />
                          <Skeleton className="h-4 w-1/2" />

                          <hr className="my-3" />

                          <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-[90px]" />
                            <Skeleton className="h-5 w-[70px]" />
                          </div>
                        </div>
                      </div>
                    ))
                  : items.map((item) => (
                      <div className="mb-2" key={item.id}>
                        <CartDrawerItem
                          id={item.id}
                          imageUrl={item.imageUrl}
                          name={item.name}
                          price={item.price}
                          details={
                            item.pizzaSize && item.pizzaType
                              ? getCartItemDetails(
                                  item.pizzaType as PizzaType,
                                  item.pizzaSize as PizzaSize,
                                  item.ingredients,
                                )
                              : ""
                          }
                          quantity={item.quantity}
                          onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                          onClickRemove={() => removeCartItem(item.id)}
                        />
                      </div>
                    ))}
              </div>

              <SheetFooter className="bg-white p-8">
                <div className="w-full">
                  <div className="mb-4 flex">
                    <span className="flex flex-1 text-lg text-neutral-500">
                      Итого
                      <div className="relative -top-1 mx-2 flex-1 border-b border-dashed border-b-neutral-200" />
                    </span>
                    <span className="text-lg font-bold">{totalAmount} ₽</span>
                  </div>
                  <Link href="/cart">
                    <Button
                      type="submit"
                      disabled={loading}
                      className={cn("h-12 w-full text-base", loading && "bg-black")}
                    >
                      {loading ? (
                        <LoaderCircle className="ml-3 animate-spin" size={16} />
                      ) : (
                        <>
                          Оформить заказ <ArrowRight className="ml-2 w-5" />{" "}
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
