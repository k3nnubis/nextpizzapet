"use client";

import React from "react";

import { FilterCheckbox, FilterCheckboxProps } from "./filter-checkbox";
import { Input } from "../ui/input";

type Item = FilterCheckboxProps;

interface Props {
  title: string;
  items: Item[];
  defaultItems?: Item[];
  limit?: number;
  searchInputPlaceholder?: string;
  className?: string;
  selected?: Set<string>;
  onClickCheckbox?: (id: string) => void;
  loading?: boolean;
  name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = "Поиск...",
  className,
  selected,
  onClickCheckbox,
  loading,
  name,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filtredItems = items.filter((item) =>
    item.text.toLowerCase().includes(searchValue.toLowerCase()),
  );

  if (loading) {
    return (
      <div className={className}>
        <p className="mb-3 font-bold">{title}</p>

        {Array(limit)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="mb-4 h-6 w-full animate-pulse rounded-[8px] bg-gray-200"
            />
          ))}

        <div className="h-4 w-28 animate-pulse rounded-[8px] bg-gray-200" />
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="mb-3 font-bold">{title}</p>

      {showAll && (
        <div className="mb-5">
          <Input
            placeholder={searchInputPlaceholder}
            className="border-none bg-gray-50"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      )}

      <div className="scrollbar flex max-h-96 flex-col gap-4 overflow-auto pr-2">
        {(showAll ? filtredItems : defaultItems || filtredItems).map((item) => (
          <FilterCheckbox
            onCheckedChange={() => onClickCheckbox?.(item.value)}
            checked={selected?.has(item.value)}
            key={String(item.value)}
            value={item.value}
            text={item.text}
            endAdornment={item.endAdornment}
            name={name}
          />
        ))}
      </div>

      {items.length > limit && (
        <div className={showAll ? "mt-4 border-t border-t-neutral-100" : ""}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary mt-3"
          >
            {showAll ? "Скрыть" : "+ Показать все"}
          </button>
        </div>
      )}
    </div>
  );
};
