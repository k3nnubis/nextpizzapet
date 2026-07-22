import { Order } from "@prisma/client";
import { Container } from "./container";
import { Title } from "./title";
import { OrderItem } from "./order-item";

interface OrdersShowingProps {
  orders: Order[];
}

export function OrdersShowing({ orders }: OrdersShowingProps) {
  return (
    <div className="my-10 flex flex-1 flex-col gap-5">
      <Title text="Ваши заказы" size="md" className="font-bold" />

      <div className="mb-20 flex flex-1 flex-col gap-10">
        {orders.length < 0 ? (
          <p className="text-xl font-bold">У вас еще не было заказов.</p>
        ) : (
          orders.map((order) => (
            <OrderItem
              key={order.id}
              id={order.id}
              items={order.items ? JSON.parse(order.items as string) : []}
              createdAt={order.createdAt.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
              totalAmount={order.totalAmount}
              status={order.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
