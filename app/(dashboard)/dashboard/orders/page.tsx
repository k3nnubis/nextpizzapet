import { prisma } from "@/prisma/prisma-client";
import { OrderStats, OrdersCatalog, type DashboardOrder } from "@/shared/components/shared/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заказы",
};

function countItems(value: unknown) {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default async function DashboardOrdersPage() {
  const ordersData = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      totalAmount: true,
      status: true,
      items: true,
      userId: true,
      createdAt: true,
    },
  });

  const orders: DashboardOrder[] = ordersData.map(({ items, createdAt, ...order }) => ({
    ...order,
    itemsCount: countItems(items),
    createdAt: createdAt.toISOString(),
  }));

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-7">
        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-rose-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-orange-300/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-rose-400 uppercase">Продажи</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Заказы</h1>
            <p className="mt-2 text-sm leading-6 text-gray-300 sm:text-base">
              Следите за оплатой, составом и данными доставки. История заказов сохраняется без удаления.
            </p>
          </div>
        </header>

        <OrderStats orders={orders} />
        <OrdersCatalog orders={orders} />
      </div>
    </div>
  );
}
