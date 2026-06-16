import { cn } from "@/lib/utils";
import React from "react";
import { ProductImage } from "./product-image";
import { Title } from "./title";
import { Button } from "../ui";

interface ChoosePizzaFormProps {
  name: string;
  imageUrl: string;
  ingredients: any[];
  variants?: any[];
  onClickAdd?: VoidFunction;
  className?: string;
}
export function ChooseProductForm({
  name,
  variants,
  imageUrl,
  ingredients,
  onClickAdd,
  className,
}: ChoosePizzaFormProps) {
  const textDetails = "30 см, традиционное тесто 30";
  const totalPrice = 350;

  return (
    <div className={cn("flex flex-1", className)}>
      <div className="relative flex w-full flex-1 items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="relative top-2 left-2 z-10 h-[350px] w-[350px] transition-all duration-300"
        />
      </div>

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="mb-1 font-extrabold" />

        <p className="text-gray-400">{textDetails}</p>

        <Button className="h-[55px] w-full rounded-[18px] px-10 text-base mt-10">
          Добавить в корзину за {totalPrice} Р
        </Button>
      </div>
    </div>
  );
}
