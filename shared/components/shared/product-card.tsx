import Link from "next/link";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import Image from "next/image";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  className,
}) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="bg-secondary flex h-[260px] justify-center rounded-lg p-6">
          <img
            className="h-[215px] w-[215px] transition-all duration-200 hover:translate-y-[5px] hover:transform"
            src={imageUrl}
            alt={name}
          />
        </div>

        <Title text={name} size="sm" className="mt-3 mb-1 font-bold" />

        <p className="text-sm text-gray-400">
          Цыпленок, моцарела, сыры чеддер и пармезан, сырный соус, томаты. соус
          альфредо, чеснок
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[20px]">
          от <b>{price} ₽</b>
        </span>

        <Button variant={"secondary"}>
          <Plus size={20} className="mr-1" />
          Добавить
        </Button>
      </div>
    </div>
  );
};
