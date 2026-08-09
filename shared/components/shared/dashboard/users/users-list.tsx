"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button, Input } from "@/shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useUserModalStore } from "@/shared/store";
import type { User } from "@/src/generated/prisma/client";
import {
  CheckCircle2,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type UserListItem = Pick<
  User,
  "id" | "fullName" | "email" | "role" | "status" | "verified" | "lastLoginAt" | "createdAt"
>;

interface UsersListProps {
  users: UserListItem[];
}

type Filter = "ALL" | "USER" | "ADMIN" | "ACTIVE" | "BLOCKED";

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function UserActions({ userId }: { userId: number }) {
  const openDeleteModal = useUserModalStore((state) => state.openModal);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Действия с пользователем">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/users/${userId}`} className="cursor-pointer">
            <UserRound /> Открыть карточку
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onSelect={() => openDeleteModal(userId)}
        >
          <Trash2 /> Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UsersList({ users }: UsersListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const stats = [
    { label: "Всего", value: users.length, icon: UsersRound },
    { label: "Активные", value: users.filter((user) => user.status === "ACTIVE").length, icon: CheckCircle2 },
    {
      label: "Администраторы",
      value: users.filter((user) => user.role === "ADMIN").length,
      icon: ShieldCheck,
    },
    { label: "Не подтверждены", value: users.filter((user) => !user.verified).length, icon: UserRound },
  ];

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");

    return users.filter((user) => {
      const matchesQuery =
        !normalizedQuery ||
        user.fullName.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        user.email.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        String(user.id).includes(normalizedQuery);
      const matchesFilter = filter === "ALL" || user.role === filter || user.status === filter;

      return matchesQuery && matchesFilter;
    });
  }, [filter, query, users]);

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <item.icon className="size-4" /> {item.label}
            </div>
            <p className="mt-2 text-2xl font-extrabold">{item.value.toLocaleString("ru-RU")}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Имя, e-mail или ID"
              aria-label="Поиск пользователей"
              className="h-10 pl-9"
            />
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
            <SelectTrigger className="h-10 w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все пользователи</SelectItem>
              <SelectItem value="ACTIVE">Только активные</SelectItem>
              <SelectItem value="BLOCKED">Только заблокированные</SelectItem>
              <SelectItem value="ADMIN">Администраторы</SelectItem>
              <SelectItem value="USER">Пользователи</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredUsers.length ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead>Регистрация</TableHead>
                    <TableHead className="w-12">
                      <span className="sr-only">Действия</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Link href={`/dashboard/users/${user.id}`} className="group flex items-center gap-3">
                          <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold">
                            {initials(user.fullName)}
                          </span>
                          <span className="min-w-0">
                            <span className="group-hover:text-primary block font-semibold transition-colors">
                              {user.fullName}
                            </span>
                            <span className="text-muted-foreground block max-w-72 truncate text-xs">
                              #{user.id} · {user.email}
                            </span>
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{user.role === "ADMIN" ? "Администратор" : "Пользователь"}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleString("ru-RU")
                          : "Ещё не входил"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                      </TableCell>
                      <TableCell>
                        <UserActions userId={user.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y lg:hidden">
              {filteredUsers.map((user) => (
                <article key={user.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold">
                      {initials(user.fullName)}
                    </span>
                    <Link href={`/dashboard/users/${user.id}`} className="min-w-0 flex-1">
                      <p className="truncate font-bold">{user.fullName}</p>
                      <p className="text-muted-foreground truncate text-sm">{user.email}</p>
                    </Link>
                    <UserActions userId={user.id} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
                    </Badge>
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
                    <span className="text-muted-foreground ml-auto text-xs">ID #{user.id}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center px-4 py-14 text-center">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
              <Search className="text-muted-foreground size-5" />
            </div>
            <p className="mt-4 font-bold">Пользователи не найдены</p>
            <p className="text-muted-foreground mt-1 text-sm">Попробуйте изменить запрос или фильтр.</p>
          </div>
        )}

        <div className="text-muted-foreground border-t px-4 py-3 text-sm">
          Показано {filteredUsers.length} из {users.length}
        </div>
      </section>
    </div>
  );
}
