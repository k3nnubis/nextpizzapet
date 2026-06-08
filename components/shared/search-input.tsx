"use client";

import { cn } from "@/lib/utils";
import { Api } from "@/services/api-client";
import { Product } from "@prisma/client";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import { useClickAway, useDebounce } from "react-use";

interface Props {
  className?: string;
}

export const SearchInput: React.FC<React.PropsWithChildren<Props>> = ({
  className,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setFocused(false);
  });

  useDebounce(async () => {
    try {
      setIsLoading(true);
      const response = await Api.products.search(searchQuery);
      setProducts(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  },
    250,
    [searchQuery],
  );

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery("");
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-all duration-200",
          focused ? "opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      />

      <div
        ref={ref}
        className={cn(
          "relative z-30 flex h-11 flex-1 justify-between rounded-2xl",
          className,
        )}
      >
        <Search className="absolute top-1/2 left-3 h-5 translate-y-[-50%] text-gray-400" />
        <input
          className="w-full rounded-2xl bg-gray-100 pl-11 outline-none"
          type="text"
          placeholder="Найти пиццу..."
          onFocus={() => setFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div
          className={cn(
            "invisible absolute top-14 z-30 w-full rounded-2xl bg-white py-2 opacity-0 shadow-md transition-all duration-200",
            focused && "visible top-12 opacity-100",
          )}
        >
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-400">Ищем...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link
                onClick={onClickItem}
                key={product.id}
                className="hover:bg-primary/10 flex w-full cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-200"
                href={`/product/${product.id}`}
              >
                <img
                  className="h-8 w-8 rounded-sm"
                  src={product.imageUrl}
                  width={32}
                  height={32}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </Link>
            ))
          ) : searchQuery.trim() ? (
            <div className="px-3 py-2 text-sm text-gray-400">
              Ничего не найдено
            </div>
          ) : null}
        </div>
      </div >
    </>
  );
};
