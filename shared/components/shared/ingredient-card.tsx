import { cn } from "@/shared/lib/utils";
import { CircleCheck } from "lucide-react";
import React from "react";

interface IngredientCardProps {
  name: string;
  imageUrl: string;
  price: number;
  id: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function IngredientCard({
  className,
  name,
  imageUrl,
  price,
  id,
  onClick,
  active,
}: IngredientCardProps) {
  return (
    <div
      className={cn(
        className,
        "relative flex min-h-[193px] w-32 cursor-pointer flex-col overflow-hidden rounded-[15px] bg-white px-2.5 py-3 shadow-md transition-all duration-300",
        {
          "border-primary border": active,
        },
      )}
      onClick={onClick}
    >
      {active && (
        <CircleCheck className="text-primary absolute top-2 right-2" />
      )}
      <img
        src={imageUrl}
        alt={name}
        className="aspect-square h-[110px] w-[110px] select-none"
      />
      <span className="mt-1.5 max-w-[105px] text-center text-xs select-none">
        {name}
      </span>
      <span className="mt-auto text-center text-sm font-bold select-none">
        {price} ₽
      </span>
    </div>
  );
}
