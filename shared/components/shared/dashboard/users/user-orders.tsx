"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { Order } from "@/src/generated/prisma/client";
import { ChevronLeft, ChevronRight, ExternalLink, PackageOpen } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface UserOrdersProps {
  className?: string;
  orders: Order[];
}

const statusLabel = { PENDING: "Ожидает оплаты", SUCCEEDED: "Оплачен", CANCELLED: "Отменён" } as const;
const statusClass = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  SUCCEEDED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-red-200 bg-red-50 text-red-800",
} as const;
const PAGE_SIZE = 5;

export const UserOrders = ({ orders, className }: UserOrdersProps) => {
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const result = status === "ALL" ? [...orders] : orders.filter((order) => order.status === status);
    result.sort((a, b) => {
      if (sort === "amount-desc") return b.totalAmount - a.totalAmount;
      if (sort === "amount-asc") return a.totalAmount - b.totalAmount;
      return sort === "oldest"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [orders, sort, status]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className={cn("rounded-2xl border bg-white p-4", className)}>
      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все статусы</SelectItem>
            <SelectItem value="PENDING">Ожидают оплаты</SelectItem>
            <SelectItem value="SUCCEEDED">Оплачены</SelectItem>
            <SelectItem value="CANCELLED">Отменены</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
            <SelectItem value="amount-desc">Сначала дорогие</SelectItem>
            <SelectItem value="amount-asc">Сначала дешёвые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center text-center">
          <PackageOpen className="text-muted-foreground mb-3 size-10" />
          <p className="font-bold">Заказов не найдено</p>
          <p className="text-muted-foreground text-sm">Попробуйте выбрать другой статус.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead className="text-right">Подробнее</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell><Badge variant="outline" className={statusClass[order.status]}>{statusLabel[order.status]}</Badge></TableCell>
                <TableCell className="font-bold">{order.totalAmount.toLocaleString("ru-RU")} ₽</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString("ru-RU")}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="icon-sm" variant="ghost">
                    <Link href={`/dashboard/orders/${order.id}`} aria-label={`Открыть заказ ${order.id}`}><ExternalLink /></Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {filteredOrders.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
          <span className="text-muted-foreground">Страница {currentPage} из {pageCount}</span>
          <div className="flex gap-2">
            <Button size="icon-sm" variant="outline" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft /></Button>
            <Button size="icon-sm" variant="outline" disabled={currentPage === pageCount} onClick={() => setPage((value) => value + 1)}><ChevronRight /></Button>
          </div>
        </div>
      )}
    </div>
  );
};
