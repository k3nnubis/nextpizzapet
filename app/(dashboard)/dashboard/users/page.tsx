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
        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-orange-400 uppercase">
              Структура каталога
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Пользователи</h1>
            <p className="mt-2 text-sm leading-6 text-gray-300 sm:text-base">
              Управляйте профилями, доступом и состоянием учётных записей.
            </p>
          </div>
        </header>
        <UsersList users={users} />
      </div>
    </div>
  );
}
