import { CircleCheck, Clock3, ReceiptText, WalletCards } from "lucide-react";
import type { DashboardOrder } from "./order-types";

export function OrderStats({ orders }: { orders: DashboardOrder[] }) {
  const paidOrders = orders.filter((order) => order.status === "SUCCEEDED");
  const stats = [
    {
      label: "Всего заказов",
      value: orders.length.toLocaleString("ru-RU"),
      icon: ReceiptText,
      iconClassName: "bg-rose-100 text-rose-700",
    },
    {
      label: "Ожидают оплаты",
      value: orders.filter((order) => order.status === "PENDING").length.toLocaleString("ru-RU"),
      icon: Clock3,
      iconClassName: "bg-amber-100 text-amber-700",
    },
    {
      label: "Оплачены",
      value: paidOrders.length.toLocaleString("ru-RU"),
      icon: CircleCheck,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Выручка",
      value: `${paidOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString("ru-RU")} ₽`,
      icon: WalletCards,
      iconClassName: "bg-sky-100 text-sky-700",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Статистика заказов">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <span className={`flex size-10 items-center justify-center rounded-xl ${stat.iconClassName}`}>
              <stat.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl leading-none font-extrabold">{stat.value}</p>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
