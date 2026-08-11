"use client";

import { Button, Input } from "@/shared/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { ArrowUpRight, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { OrderStatusBadge } from "./order-status-badge";
import type { DashboardOrder, DashboardOrderStatus } from "./order-types";

type StatusFilter = "ALL" | DashboardOrderStatus;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function OrdersCatalog({ orders }: { orders: DashboardOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const visibleOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");

    return orders.filter((order) => {
      const matchesStatus = status === "ALL" || order.status === status;
      const matchesQuery =
        !normalizedQuery ||
        String(order.id).includes(normalizedQuery) ||
        order.fullName.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        order.email.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        order.phone.toLocaleLowerCase("ru-RU").includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [orders, query, status]);

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-extrabold">Все заказы</h2>
          <p className="text-muted-foreground text-sm">
            Показано {visibleOrders.length} из {orders.length}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-2xl">
          <div className="relative w-full sm:max-w-md">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Номер, клиент, e-mail или телефон"
              aria-label="Поиск заказов"
              className="h-10 pl-9"
            />
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
            <SelectTrigger className="h-10 w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все статусы</SelectItem>
              <SelectItem value="PENDING">Ожидают оплаты</SelectItem>
              <SelectItem value="SUCCEEDED">Оплачены</SelectItem>
              <SelectItem value="CANCELLED">Отменены</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visibleOrders.length ? (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Заказ</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Состав</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Открыть</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="font-extrabold hover:text-rose-700"
                      >
                        #{order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-64">
                        <p className="truncate font-semibold">{order.fullName}</p>
                        <p className="text-muted-foreground truncate text-xs">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{order.itemsCount.toLocaleString("ru-RU")} поз.</TableCell>
                    <TableCell className="font-extrabold">
                      {order.totalAmount.toLocaleString("ru-RU")} ₽
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/dashboard/orders/${order.id}`} aria-label={`Открыть заказ ${order.id}`}>
                          <ArrowUpRight />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y lg:hidden">
            {visibleOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold">Заказ #{order.id}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-4 font-semibold">{order.fullName}</p>
                <p className="text-muted-foreground truncate text-sm">{order.address}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">{order.itemsCount} позиций</span>
                  <span className="text-base font-extrabold">
                    {order.totalAmount.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center px-4 py-14 text-center">
          <span className="bg-muted flex size-12 items-center justify-center rounded-full">
            <ShoppingBag className="text-muted-foreground size-5" />
          </span>
          <p className="mt-4 font-bold">Заказы не найдены</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Измените поисковый запрос или выбранный статус.
          </p>
        </div>
      )}

      <div className="text-muted-foreground border-t px-4 py-3 text-sm">
        Заказы хранятся как история продаж и не удаляются из панели.
      </div>
    </section>
  );
}
