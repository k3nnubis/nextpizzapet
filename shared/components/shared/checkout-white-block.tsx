import { cn } from "@/shared/lib/utils";
import React from "react";
import { Title } from "./title";

interface CheckoutWhiteBlockProps {
  contentClassName?: string;
  title?: string;
  endAdornment?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutWhiteBlock({
  contentClassName,
  title,
  endAdornment,
  className,
  children,
}: CheckoutWhiteBlockProps) {
  return (
    <div className={cn("rounded-3xl bg-white", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-gray-100 p-5 px-7">
          <Title text={title} size="sm" className="font-bold" />
          {endAdornment}
        </div>
      )}
      <div className={cn("px-5 py-4", contentClassName)}>{children}</div>
    </div>
  );
}
