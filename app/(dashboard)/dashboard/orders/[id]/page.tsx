import { prisma } from "@/prisma/prisma-client";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type OrderItemSnapshot = {
  id: number;
  quantity: number;
  productItem?: { price?: number; product?: { name?: string } };
};

const statusLabel = { PENDING: "Ожидает оплаты", SUCCEEDED: "Оплачен", CANCELLED: "Отменён" } as const;

function parseItems(value: unknown): OrderItemSnapshot[] {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function DashboardOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id: Number(id) } });
  if (!order) return notFound();
  const items = parseItems(order.items);

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href={order.userId ? `/dashboard/users/${order.userId}` : "/dashboard/users"}
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="size-4" /> Назад к пользователю
        </Link>
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold">Заказ #{order.id}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Создан {order.createdAt.toLocaleString("ru-RU")}
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {statusLabel[order.status]}
          </Badge>
        </header>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-extrabold">Состав заказа</h2>
            <div className="mt-4 divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-bold">{item.productItem?.product?.name ?? `Позиция #${item.id}`}</p>
                    <p className="text-muted-foreground text-sm">Количество: {item.quantity}</p>
                  </div>
                  <span className="font-bold">
                    {((item.productItem?.price ?? 0) * item.quantity).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              ))}
              {!items.length && (
                <p className="text-muted-foreground py-8 text-center">Состав заказа недоступен.</p>
              )}
            </div>
            <div className="flex justify-between border-t pt-4 text-xl">
              <span>Итого</span>
              <b>{order.totalAmount.toLocaleString("ru-RU")} ₽</b>
            </div>
          </section>
          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-extrabold">Получатель</h2>
            <p className="mt-4 font-bold">{order.fullName}</p>
            <div className="text-muted-foreground mt-3 space-y-3 text-sm">
              <p className="flex gap-2">
                <Mail className="size-4 shrink-0" /> {order.email}
              </p>
              <p className="flex gap-2">
                <Phone className="size-4 shrink-0" /> {order.phone}
              </p>
              <p className="flex gap-2">
                <MapPin className="size-4 shrink-0" /> {order.address}
              </p>
            </div>
            {order.comment && (
              <div className="bg-muted mt-5 rounded-xl p-3 text-sm">
                <b>Комментарий:</b>
                <p className="mt-1">{order.comment}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
