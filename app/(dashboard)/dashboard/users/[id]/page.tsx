import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { EditUserForm, UserOrders } from "@/shared/components/shared/dashboard";
import { Title } from "@/shared/components/shared";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      cart: true,
      orders: true,
    },
  });
  if (!user) return notFound();

  return (
    <div className="w-full px-8 py-4">
      <Title text={`Пользователь ${user.fullName}`} size="lg" className="border-b font-extrabold" />
      <div className="mt-4 flex justify-between gap-3">
        <div>
          <Title text="Редактирование" size="md" className="font-bold" />
          <EditUserForm fullName={user.fullName} email={user.email} userId={user.id} />
        </div>
        <div>
          <Title text="Заказы" size="md" className="font-bold" />
          <UserOrders orders={user.orders} />
        </div>
      </div>
    </div>
  );
}
