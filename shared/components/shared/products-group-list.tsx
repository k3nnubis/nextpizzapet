"use client";

import React from "react";
import { Title } from "./title";
import { cn } from "@/shared/lib/utils";
import { ProductCard } from "./product-card";
import { useIntersection } from "react-use";
import { useCategoryStore } from "@/shared/store/category";

interface ProductGroupItem {
  id: number;
  name: string;
  imageUrl: string;
  variants: Array<{
    price: number;
  }>;
}

interface Props {
  title: string;
  items: ProductGroupItem[];
  listClassName?: string;
  categoryId: number;
  className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
  title,
  items,
  listClassName,
  categoryId,
  className,
}) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = React.useRef<HTMLDivElement>(null);
  const intersection = useIntersection(
    intersectionRef as React.RefObject<HTMLElement>,
    {
      threshold: 0.4,
    },
  );

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, setActiveCategoryId, title]);

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="mb-5 font-extrabold" />

      <div className={cn("grid grid-cols-3 gap-[50px]", listClassName)}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={
              product.variants.length > 0
                ? Math.min(...product.variants.map((variant) => variant.price))
                : 0
            }
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
