"use client";
import { cn } from "@/shared/lib/utils";
import React from "react";

export type Variant = {
  name: string;
  value: string;
  disabled?: boolean;
};

interface VariantsSelectorProps {
  items: readonly Variant[];
  onClick?: (value: Variant["value"]) => void;
  selectedValue?: Variant["value"];
  className?: string;
}

export function VariantsSelector({ items, onClick, selectedValue, className }: VariantsSelectorProps) {
  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  return (
    <div
      className={cn(
        "relative flex justify-between overflow-hidden rounded-3xl bg-[#F3F3F7] p-1 select-none",
        className,
      )}
    >
      {selectedIndex >= 0 && (
        <span
          className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-3xl bg-white shadow transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `calc((100% - 8px) / ${items.length})`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />
      )}

      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          disabled={item.disabled}
          onClick={() => onClick?.(item.value)}
          className={cn(
            "relative z-10 flex h-[30px] flex-1 cursor-pointer items-center justify-center rounded-3xl px-5 text-sm transition-colors duration-400",
            {
              "text-gray-500 opacity-50": item.disabled,
            },
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
