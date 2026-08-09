import { prisma } from "@/prisma/prisma-client";
import { UsersList } from "@/shared/components/shared/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользователи",
};

export default async function DashboardUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      verified: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Пользователи</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Управляйте профилями, доступом и состоянием учётных записей.
          </p>
        </header>
        <UsersList users={users} />
      </div>
    </div>
  );
}
