import { prisma } from "@/prisma/prisma-client";
import { Container, OrderItem, Title } from "@/shared/components/shared";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await getUserSession();

  if (!session) {
    return redirect("/not-auth");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: Number(session?.id),
    },
  });

  return (
    <Container className="my-5">
      <Title text="Ваши заказы" size="xl" className="mb-8 font-extrabold" />

      <div className="mb-20 flex w-[70%] flex-1 flex-col gap-10">
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
    </Container>
  );
}
