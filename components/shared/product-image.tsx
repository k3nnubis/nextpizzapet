import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
  imageUrl: string;
  size: number;
  productName: string;
}

export const ProductImage: React.FC<Props> = ({
  className,
  imageUrl,
  size,
  productName,
}) => {
  return (
    <div className={cn('relative flex items-center justify-center flex-1 w-full', className)}>
      <img
        src={imageUrl}
        alt={productName}
        className={cn('relative left-2 top-2 transition-all z-10 duration-300', {
          'w-[300px] h-[300px]': size === 20,
          'w-[400px] h-[400px]': size === 30,
          'w-[500px] h-[500px]': size === 40,
        })}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-gray-200 rounded-full w-[450px] h-[450px]"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-gray-100 rounded-full w-[370px] h-[370px]"></div>
    </div>
  );
};
