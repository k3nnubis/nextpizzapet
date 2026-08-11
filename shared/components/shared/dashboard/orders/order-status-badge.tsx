import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { DashboardOrderStatus } from "./order-types";

const statusConfig = {
  PENDING: {
    label: "Ожидает оплаты",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  SUCCEEDED: {
    label: "Оплачен",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  CANCELLED: {
    label: "Отменён",
    className: "border-red-200 bg-red-50 text-red-800",
  },
} satisfies Record<DashboardOrderStatus, { label: string; className: string }>;

export function OrderStatusBadge({
  status,
  className,
}: {
  status: DashboardOrderStatus;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
