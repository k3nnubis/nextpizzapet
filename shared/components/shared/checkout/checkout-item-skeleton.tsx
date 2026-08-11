import { cn } from "@/shared/lib/utils";
import React from "react";
import { Skeleton } from "../../ui";

interface CheckoutItemSkeletonProps {
  className?: string;
}

export function CheckoutItemSkeleton({ className }: CheckoutItemSkeletonProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-5">
        <Skeleton className="h-[60px] w-[60px] rounded-full bg-gray-200" />
        <Skeleton className="h-5 w-40 rounded bg-gray-200" />
      </div>
      <Skeleton className="h-5 w-10 rounded bg-gray-200" />
      <Skeleton className="h-8 w-[133px] rounded bg-gray-200" />
    </div>
  );
}
