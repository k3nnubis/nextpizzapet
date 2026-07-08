import { Skeleton } from "../../ui";
import { cn } from "@/shared/lib/utils";

interface CartItemSkeletonProps {
  className?: string;
}

export function CartItemSkeleton({ className }: CartItemSkeletonProps) {
  return (
    <div className={cn("mb-2 flex gap-6 bg-white p-5", className)}>
      <Skeleton className="h-[65px] w-[65px] rounded-full" />

      <div className="flex-1">
        <Skeleton className="mb-2 h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />

        <hr className="my-3" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[90px]" />
          <Skeleton className="h-5 w-[70px]" />
        </div>
      </div>
    </div>
  );
}
