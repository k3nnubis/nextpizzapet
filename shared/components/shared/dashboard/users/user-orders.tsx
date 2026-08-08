import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { Order } from "@/src/generated/prisma/client";
import { CircleCheck, CircleX, ClockFading, ExternalLink } from "lucide-react";
import Link from "next/link";

interface UserOrdersProps {
  className?: string;
  orders: Order[];
}

export const UserOrders = ({ orders, className }: UserOrdersProps) => {
  const paymentStatusMap = {
    PENDING: <ClockFading />,
    SUCCEEDED: <CircleCheck className="text-green-600" />,
    CANCELLED: <CircleX className="text-red-600" />,
  };
  return (
    <div className={cn("rounded-2xl bg-blue-100 px-3 py-2.5", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">ID</TableCell>
            <TableCell className="font-bold">Статус</TableCell>
            <TableCell className="font-bold">Общая сумма</TableCell>
            <TableCell className="font-bold">Создан</TableCell>
            <TableCell className="font-bold">Подробнее</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{paymentStatusMap[order.status]}</TableCell>
              <TableCell className="font-bold">{order.totalAmount} ₽</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleString("ru-RU")}</TableCell>
              <TableCell>
                <Link href="#" className="hover:text-primary flex justify-end">
                  <ExternalLink size={16} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
