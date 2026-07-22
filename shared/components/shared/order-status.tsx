import React from "react";
import { OrderStatus as IOrderStatus } from "@prisma/client";
import { Badge } from "../ui/badge";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
  variant: IOrderStatus;
  text?: string;
}

export const OrderStatus: React.FC<Props> = ({ className, variant, text }) => {
  const textStatusMap: Record<IOrderStatus, string> = {
    SUCCEEDED: "Оплачен",
    CANCELLED: "Отменен",
    PENDING: "В обработке",
  };
  return (
    <Badge
      className={cn(
        {
          "bg-green-100 text-green-700 hover:bg-green-100": variant === IOrderStatus.SUCCEEDED,
          "bg-red-100 text-red-700 hover:bg-red-100": variant === IOrderStatus.CANCELLED,
          "bg-yellow-100 text-yellow-700 hover:bg-yellow-100": variant === IOrderStatus.PENDING,
        },
        "text-sm font-normal",
        className,
      )}
    >
      {textStatusMap[variant] || text}
    </Badge>
  );
};
