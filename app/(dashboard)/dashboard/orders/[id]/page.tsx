import { prisma } from "@/prisma/prisma-client";
import { OrderStatusBadge } from "@/shared/components/shared/dashboard";
import { Button } from "@/shared/components/ui";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ReceiptText,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type OrderItemSnapshot = {
  id: number;
  quantity: number;
  ingredients?: Array<{ id: number; name?: string; price?: number }>;
  productItem?: {
    price?: number;
    size?: number | null;
    pizzaType?: number | null;
    product?: { name?: string; imageUrl?: string };
  };
};

export const metadata: Metadata = {
  title: "Заказ",
};

function parseItems(value: unknown): OrderItemSnapshot[] {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function itemPrice(item: OrderItemSnapshot) {
  const ingredientsPrice =
    item.ingredients?.reduce((sum, ingredient) => sum + (ingredient.price ?? 0), 0) ?? 0;
  return ((item.productItem?.price ?? 0) + ingredientsPrice) * item.quantity;
}

function itemDetails(item: OrderItemSnapshot) {
  const details: string[] = [];
  if (item.productItem?.size) details.push(`${item.productItem.size} см`);
  if (item.productItem?.pizzaType)
    details.push(item.productItem.pizzaType === 1 ? "традиционное тесто" : "тонкое тесто");
  return details.join(", ");
}

export default async function DashboardOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) return notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });
  if (!order) return notFound();

  const items = parseItems(order.items);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Button asChild variant="ghost" className="-ml-3">
          <Link href="/dashboard/orders">
            <ArrowLeft /> Все заказы
          </Link>
        </Button>

        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-rose-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-orange-300/10 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-rose-400 uppercase">
                Карточка заказа
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Заказ #{order.id}</h1>
              <p className="mt-2 text-sm text-gray-300">
                Создан {order.createdAt.toLocaleString("ru-RU")} · обновлён{" "}
                {order.updatedAt.toLocaleString("ru-RU")}
              </p>
            </div>
            <OrderStatusBadge status={order.status} className="w-fit border-white/15 px-3 py-1 text-sm" />
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Сводка заказа">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <ReceiptText className="size-5" />
              </span>
              <div>
                <p className="text-xl font-extrabold">{totalQuantity}</p>
                <p className="text-muted-foreground text-sm">Товаров в заказе</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="text-xl font-extrabold">{order.totalAmount.toLocaleString("ru-RU")} ₽</p>
                <p className="text-muted-foreground text-sm">Сумма заказа</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <UserRound className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold">{order.fullName}</p>
                <p className="text-muted-foreground text-sm">Получатель</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-xl font-extrabold">Состав заказа</h2>
              <p className="text-muted-foreground mt-1 text-sm">Снимок товаров и цен на момент оформления</p>
            </div>
            {items.length ? (
              <div className="divide-y">
                {items.map((item, index) => {
                  const details = itemDetails(item);
                  return (
                    <article key={`${item.id}-${index}`} className="flex gap-4 p-4 sm:p-5">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-orange-50 sm:size-24">
                        {item.productItem?.product?.imageUrl ? (
                          <Image
                            src={item.productItem.product.imageUrl}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-contain p-2"
                          />
                        ) : (
                          <span className="text-muted-foreground flex h-full items-center justify-center text-xs">
                            Нет фото
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-extrabold">
                              {item.productItem?.product?.name ?? `Позиция #${item.id}`}
                            </h3>
                            {details && <p className="text-muted-foreground mt-1 text-sm">{details}</p>}
                          </div>
                          <p className="shrink-0 font-extrabold">
                            {itemPrice(item).toLocaleString("ru-RU")} ₽
                          </p>
                        </div>
                        {!!item.ingredients?.length && (
                          <p className="text-muted-foreground mt-2 text-sm">
                            Добавки:{" "}
                            {item.ingredients
                              .map((ingredient) => ingredient.name)
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                        <p className="mt-2 text-sm font-semibold">
                          {item.quantity} шт. ×{" "}
                          {(itemPrice(item) / item.quantity || 0).toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-12 text-center">
                <ReceiptText className="text-muted-foreground mx-auto size-7" />
                <p className="mt-3 font-bold">Состав заказа недоступен</p>
                <p className="text-muted-foreground mt-1 text-sm">Снимок корзины не удалось прочитать.</p>
              </div>
            )}
            <div className="flex items-center justify-between border-t bg-gray-50 px-5 py-4 text-xl">
              <span className="font-semibold">Итого</span>
              <strong>{order.totalAmount.toLocaleString("ru-RU")} ₽</strong>
            </div>
          </section>

          <div className="space-y-5">
            <aside className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-xl font-extrabold">Доставка и контакты</h2>
              <p className="mt-4 font-bold">{order.fullName}</p>
              <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                <a href={`mailto:${order.email}`} className="flex items-start gap-2 hover:text-rose-700">
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  <span className="break-all">{order.email}</span>
                </a>
                <a href={`tel:${order.phone}`} className="flex items-start gap-2 hover:text-rose-700">
                  <Phone className="mt-0.5 size-4 shrink-0" />
                  {order.phone}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>{order.address}</span>
                </p>
              </div>
              {order.user ? (
                <Button asChild variant="outline" className="mt-5 w-full">
                  <Link href={`/dashboard/users/${order.user.id}`}>
                    <UserRound /> Профиль пользователя
                  </Link>
                </Button>
              ) : (
                <p className="text-muted-foreground mt-5 rounded-xl bg-gray-50 p-3 text-sm">
                  Заказ оформлен без привязанного профиля.
                </p>
              )}
            </aside>

            {order.comment && (
              <aside className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="size-5 text-amber-700" />
                  <h2 className="font-extrabold">Комментарий</h2>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-6 whitespace-pre-wrap">
                  {order.comment}
                </p>
              </aside>
            )}

            <aside className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="font-extrabold">Платёж</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Статус</dt>
                  <dd>
                    <OrderStatusBadge status={order.status} />
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">ID платежа</dt>
                  <dd className="max-w-48 truncate font-mono text-xs" title={order.paymentId ?? undefined}>
                    {order.paymentId ?? "Не присвоен"}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
