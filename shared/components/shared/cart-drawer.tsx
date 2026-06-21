"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { Button } from "../ui";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";

interface CartDrawerProps {
  className?: string;
  children?: React.ReactNode;
}

export function CartDrawer({ className, children }: CartDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between bg-[#F4F1EE] pb-0">
        <SheetHeader className="mt-2">
          <SheetTitle>
            В корзине <span className="font-bold">3 товара</span>
          </SheetTitle>
        </SheetHeader>

        <div className="scrollbar mt-5 flex-1 overflow-auto">
          <div className="mb-2">
            <CartDrawerItem
              id={1}
              imageUrl={"/products-unique/syrnaya.avif"}
              name={"Сырная"}
              price={419}
              details={getCartItemDetails(2, 30, [{ name: "Цыпленок" }, { name: "Курица" }])}
              quantity={1}
            />
          </div>
        </div>

        <SheetFooter className="bg-white p-8">
          <div className="w-full">
            <div className="mb-4 flex">
              <span className="flex flex-1 text-lg text-neutral-500">
                Итого
                <div className="relative -top-1 mx-2 flex-1 border-b border-dashed border-b-neutral-200" />
              </span>
              <span className="text-lg font-bold">500 Р</span>
            </div>
            <Link href="/cart">
              <Button type="submit" className="h-12 w-full text-base">
                Оформить заказ
                <ArrowRight className="ml-2 w-5" />
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
