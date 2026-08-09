import { prisma } from "@/prisma/prisma-client";
import { Badge } from "@/shared/components/ui/badge";
import {
  EditUserForm,
  UserDangerZone,
  UserOrders,
  UserSecurityForm,
} from "@/shared/components/shared/dashboard";
import { getUserSession } from "@/shared/lib/get-user-session";
import { ArrowLeft, CalendarDays, CircleDollarSign, History, ReceiptText, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const auditLabels: Record<string, string> = {
  USER_UPDATED: "Изменены данные профиля",
  PASSWORD_RESET: "Изменён пароль",
  PASSWORD_RESET_LINK_SENT: "Отправлена ссылка для сброса пароля",
  USER_BLOCKED: "Пользователь заблокирован",
  USER_UNBLOCKED: "Пользователь разблокирован",
  SESSIONS_INVALIDATED: "Завершены все сессии",
};

function formatMoney(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId)) return notFound();

  const [user, session, auditLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { orders: { orderBy: { createdAt: "desc" } } },
    }),
    getUserSession(),
    prisma.adminAuditLog.findMany({
      where: { targetUserId: userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  if (!user) return notFound();

  const paidOrders = user.orders.filter((order) => order.status === "SUCCEEDED");
  const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrder = paidOrders.length ? Math.round(totalSpent / paidOrders.length) : 0;
  const lastOrder = user.orders[0];
  const initials = user.fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const isCurrentUser = Number(session?.id) === user.id;

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <Link
          href="/dashboard/users"
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="size-4" /> К пользователям
        </Link>

        <header className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="bg-primary/10 text-primary flex size-16 shrink-0 items-center justify-center rounded-full text-xl font-extrabold">
            {initials || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-extrabold sm:text-3xl">{user.fullName}</h1>
              <Badge variant="secondary">{user.role === "ADMIN" ? "Администратор" : "Пользователь"}</Badge>
              <Badge
                variant="outline"
                className={
                  user.status === "ACTIVE"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }
              >
                {user.status === "ACTIVE" ? "Активен" : "Заблокирован"}
              </Badge>
              <Badge variant="outline">
                {user.verified ? "E-mail подтверждён" : "E-mail не подтверждён"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm break-all">
              ID #{user.id} · {user.email}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Зарегистрирован {user.createdAt.toLocaleString("ru-RU")}
              {user.lastLoginAt
                ? ` · Последний вход ${user.lastLoginAt.toLocaleString("ru-RU")}`
                : " · Ещё не входил"}
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Всего заказов", value: user.orders.length.toLocaleString("ru-RU"), icon: ShoppingBag },
            { label: "Оплачено", value: formatMoney(totalSpent), icon: CircleDollarSign },
            { label: "Средний чек", value: formatMoney(averageOrder), icon: ReceiptText },
            {
              label: "Последний заказ",
              value: lastOrder ? lastOrder.createdAt.toLocaleDateString("ru-RU") : "Нет заказов",
              icon: CalendarDays,
            },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <item.icon className="size-4" /> {item.label}
              </div>
              <p className="mt-2 text-2xl font-extrabold">{item.value}</p>
            </div>
          ))}
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-xl font-extrabold">Основные данные</h2>
              <EditUserForm
                userId={user.id}
                fullName={user.fullName}
                email={user.email}
                role={user.role}
                status={user.status}
                verified={Boolean(user.verified)}
                isCurrentUser={isCurrentUser}
              />
            </section>
            <section className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-xl font-extrabold">Безопасность</h2>
              <UserSecurityForm userId={user.id} />
            </section>
          </div>

          <section className="min-w-0">
            <h2 className="mb-3 text-xl font-extrabold">Заказы</h2>
            <UserOrders orders={user.orders} />
          </section>
        </div>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-extrabold">
            <History className="size-5" /> История действий
          </h2>
          {auditLogs.length ? (
            <div className="mt-4 divide-y">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex flex-col justify-between gap-1 py-3 text-sm sm:flex-row">
                  <span className="font-semibold">{auditLabels[log.action] ?? log.action}</span>
                  <span className="text-muted-foreground">
                    Администратор #{log.actorId} · {log.createdAt.toLocaleString("ru-RU")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-3 text-sm">Административных изменений пока не было.</p>
          )}
        </section>

        <UserDangerZone
          userId={user.id}
          isBlocked={user.status === "BLOCKED"}
          isCurrentUser={isCurrentUser}
        />
      </div>
    </div>
  );
}
