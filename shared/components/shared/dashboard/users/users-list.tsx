"use client";
import { Button } from "@/shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { UserRoleLabel } from "@/shared/constants/dashboard/user-roles";
import { useUserModalStore } from "@/shared/store";
import { User } from "@prisma/client";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  const setModalOpen = useUserModalStore((state) => state.openModal);
  const pathname = usePathname();
  return (
    <div className="bg-accent rounded-3xl p-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-s font-bold">ID</TableHead>
            <TableHead className="text-s font-bold">Полное имя</TableHead>
            <TableHead className="text-s font-bold">E-mail</TableHead>
            <TableHead className="text-s font-bold">Роль</TableHead>
            <TableHead className="text-s font-bold">Верифицирован</TableHead>
            <TableHead className="text-s font-bold">Провайдер</TableHead>
            <TableHead className="text-s font-bold">Зарегистрирован</TableHead>
            <TableHead className="text-s font-bold">Обновлён</TableHead>
            <TableHead className="text-s text-center font-bold">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow className="hover:text-primary" key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{UserRoleLabel[user.role]}</TableCell>
              <TableCell>
                {user.verified ? `${new Date(user.verified).toLocaleString("ru-RU")}` : "—"}
              </TableCell>
              <TableCell>{user.provider ? `${user.provider}` : "—"}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleString("ru-RU")}</TableCell>
              <TableCell>{new Date(user.updatedAt).toLocaleString("ru-RU")}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:text-primary hover:bg-gray-200" asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Открыть меню</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-fit">
                    <DropdownMenuItem className="cursor-pointer transition-all duration-300">
                      <Link href={`${pathname}/${user.id}`}>Изменить</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setModalOpen(user.id)}
                      className="cursor-pointer transition-all duration-300"
                      variant="destructive"
                    >
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
