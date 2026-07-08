import { CheckoutWhiteBlock } from "./checkout-white-block";
import { CheckoutItemDetails } from "./checkout-item-details";
import { ArrowRight, Package, Truck } from "lucide-react";
import { Button, Skeleton } from "../../ui";
import { cn } from "@/shared/lib/utils";
const DELIVERY_PRICE = 250;

interface CheckoutSidebarProps {
  totalAmount: number;
  loading?: boolean;
  className?: string;
}

export function CheckoutSidebar({ totalAmount, loading, className }: CheckoutSidebarProps) {
  const totalPrice = totalAmount + DELIVERY_PRICE;

  return (
    <CheckoutWhiteBlock className={cn("sticky top-4 p-6", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-xl">Итого:</span>
        <span className="text-[34px] font-extrabold">
          <div className="text-[34px] font-extrabold">
            {loading ? (
              <Skeleton className="h-[46px] w-28 rounded bg-gray-200" />
            ) : (
              <span>{totalPrice} ₽</span>
            )}
          </div>
        </span>
      </div>
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Package size={18} className="mr-2 text-gray-300" />
            Стоимость товаров:
          </div>
        }
        value={String(totalAmount)}
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Truck size={18} className="mr-2 text-gray-300" />
            Доставка:
          </div>
        }
        value={`${DELIVERY_PRICE} ₽`}
      />
      <Button type="submit" className="mt-6 h-14 w-full rounded-2xl text-base font-bold">
        Перейти к оплате
        <ArrowRight className="ml-2 w-5" />
      </Button>
    </CheckoutWhiteBlock>
  );
}
