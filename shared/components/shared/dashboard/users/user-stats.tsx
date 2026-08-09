import { CheckCircle2, CircleAlert, ShieldCheck, UsersRound } from "lucide-react";
import type { DashboardUser } from "./user-types";

interface UserStatsProps {
  users: DashboardUser[];
}

export function UserStats({ users }: UserStatsProps) {
  const stats = [
    {
      label: "Всего пользователей",
      value: users.length,
      icon: UsersRound,
      iconClassName: "bg-orange-100 text-orange-700",
    },
    {
      label: "Активные",
      value: users.filter((user) => user.status === "ACTIVE").length,
      icon: CheckCircle2,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Администраторы",
      value: users.filter((user) => user.role === "ADMIN").length,
      icon: ShieldCheck,
      iconClassName: "bg-sky-100 text-sky-700",
    },
    {
      label: "Не подтверждены",
      value: users.filter((user) => !user.verified).length,
      icon: CircleAlert,
      iconClassName: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Статистика пользователей">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <span className={`flex size-10 items-center justify-center rounded-xl ${stat.iconClassName}`}>
              <stat.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl leading-none font-extrabold">{stat.value.toLocaleString("ru-RU")}</p>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
