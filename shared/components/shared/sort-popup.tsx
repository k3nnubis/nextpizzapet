"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  className?: string;
}

const sortOptions = [
  { value: "popular", label: "по популярности" },
  { value: "newest", label: "сначала новые" },
  { value: "price-asc", label: "сначала дешевле" },
  { value: "price-desc", label: "сначала дороже" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

function isSortValue(value: string | null): value is SortValue {
  return sortOptions.some((option) => option.value === value);
}

export const SortPopup: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const currentSort = searchParams.get("sortBy");
  const value = isSortValue(currentSort) ? currentSort : "popular";

  const handleSortChange = (nextSort: SortValue) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSort === "popular") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", nextSort);
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  return (
    <Select value={value} onValueChange={(nextValue) => handleSortChange(nextValue as SortValue)}>
      <SelectTrigger
        aria-label="Выбрать сортировку товаров"
        disabled={isPending}
        className={cn("h-[52px] rounded-2xl border-0 bg-gray-50 px-4 shadow-none sm:px-5", className)}
      >
        <ArrowUpDown className="text-foreground" aria-hidden="true" />
        <span className="hidden font-bold sm:inline">Сортировка:</span>
        <SelectValue className="text-primary font-bold" />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-52">
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
