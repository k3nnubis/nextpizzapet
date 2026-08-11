import { prisma } from "@/prisma/prisma-client";
import { Container, OrdersShowing, ProfileForm } from "@/shared/components/shared";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getUserSession();

  if (!session) {
    return redirect("/not-auth");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: Number(session?.id),
    },
  });
  if (!user) return redirect("/not-auth");
  const orders = await prisma.order.findMany({
    where: {
      userId: Number(session?.id),
    },
  });
  return (
    <Container className="flex justify-between">
      <ProfileForm data={user} />
      <OrdersShowing orders={orders} />
    </Container>
  );
}
