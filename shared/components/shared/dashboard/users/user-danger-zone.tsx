"use client";

import {
  deleteDashboardUser,
  invalidateUserSessions,
  setUserBlocked,
} from "@/app/(dashboard)/dashboard/actions";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { Ban, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface UserDangerZoneProps {
  userId: number;
  isBlocked: boolean;
  isCurrentUser: boolean;
}

export function UserDangerZone({ userId, isBlocked, isCurrentUser }: UserDangerZoneProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<void>, success: string) => {
    startTransition(async () => {
      try {
        await action();
        toast.success(success);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Операция не выполнена");
      }
    });
  };

  const removeUser = () => {
    startTransition(async () => {
      try {
        await deleteDashboardUser(userId);
        toast.success("Пользователь удалён");
        router.push("/dashboard/users");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось удалить пользователя");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <h2 className="text-xl font-extrabold text-red-950">Опасная зона</h2>
      <p className="mt-1 text-sm text-red-800">Эти действия влияют на доступ пользователя к аккаунту.</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <Button variant="outline" disabled={pending} onClick={() => run(() => invalidateUserSessions(userId), "Все сессии отозваны")}>
          <LogOut /> Завершить все сессии
        </Button>
        <Button
          variant="outline"
          disabled={pending || isCurrentUser}
          onClick={() => run(() => setUserBlocked(userId, !isBlocked), isBlocked ? "Пользователь разблокирован" : "Пользователь заблокирован")}
        >
          <Ban /> {isBlocked ? "Разблокировать" : "Заблокировать"}
        </Button>
        <Button variant="destructive" disabled={pending || isCurrentUser} onClick={() => setDeleteOpen(true)}>
          <Trash2 /> Удалить пользователя
        </Button>
      </div>
      {isCurrentUser && <p className="mt-3 text-xs text-red-700">Собственную учётную запись нельзя заблокировать или удалить.</p>}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить пользователя?</DialogTitle>
            <DialogDescription>
              Учётная запись будет удалена без возможности восстановления. История заказов сохранится.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Отмена</Button>
            <Button variant="destructive" disabled={pending} onClick={removeUser}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
