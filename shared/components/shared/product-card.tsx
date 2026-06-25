"use client";

import Link from "next/link";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import { Ingredient } from "@/src/generated/prisma/client";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
  isSingleProduct: boolean;
  queryString?: string;
  ingredients?: Ingredient[];
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  isSingleProduct,
  ingredients,
  queryString,
  className,
}) => {
  const productHref = "/product/" + id + (queryString ? "?" + queryString : "");

  return (
    <div className={className}>
      <Link href={productHref}>
        <div className="bg-secondary flex h-[260px] justify-center rounded-lg p-6">
          <img
            className="h-[215px] w-[215px] transition-all duration-200 hover:translate-y-[5px] hover:transform"
            src={imageUrl}
            alt={name}
          />
        </div>

        <Title text={name} size="sm" className="mt-3 mb-1 font-bold" />
        {ingredients && (
          <p className="text-sm text-gray-400">
            {ingredients.map((ingredient) => ingredient.name).join(", ")}
          </p>
        )}
      </Link>

      <div className="mt-4 flex items-center justify-between">
        {isSingleProduct ? (
          <span className="text-[20px]">
            от <b>{price} ₽</b>
          </span>
        ) : (
          <span className="text-[20px]">
            <b>{price} ₽</b>
          </span>
        )}
        <Link href={productHref}>
          <Button variant={"secondary"}>
            <Plus size={20} className="mr-1" />
            Добавить
          </Button>
        </Link>
      </div>
    </div>
  );
};
