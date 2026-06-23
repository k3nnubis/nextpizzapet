import { cn } from "@/shared/lib/utils";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { LoaderCircle } from "lucide-react";

interface ChooseProductFormProps {
  name: string;
  imageUrl: string;
  onSubmit?: VoidFunction;
  className?: string;
  price: number;
  loading?: boolean;
}
export function ChooseProductForm({
  name,
  imageUrl,
  onSubmit,
  loading,
  price,
  className,
}: ChooseProductFormProps) {
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

        <Button
          onClick={() => onSubmit?.()}
          className={cn(
            "mt-10 h-[55px] w-full rounded-[18px] px-10 text-base transition-all duration-300",
            loading && "bg-black",
          )}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="ml-3 animate-spin" size={16} />
          ) : (
            `Добавить в корзину за ${price} ₽`
          )}
        </Button>
      </div>
    </div>
  );
}
