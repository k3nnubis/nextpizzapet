"use client";
import { Button, Dialog, DialogClose, DialogContent } from "@/shared/components/ui";
import { Title } from "../../../title";
import { deleteUser } from "@/shared/lib/user-dashboard-actions";
import toast from "react-hot-toast";
import { useUserModalStore } from "@/shared/store";

export function DeleteUserAgreement() {
  const opened = useUserModalStore((state) => state.open);
  const closeModal = useUserModalStore((state) => state.closeModal);
  const userId = useUserModalStore((state) => state.userId);
  const handleClose = () => {
    closeModal();
  };
  const handleDelete = async () => {
    try {
      if (!userId) {
        toast.error("Произошла ошибка при удалении пользователя");
        return;
      }

      await deleteUser(userId);
      toast.success("Пользователь успешно удален");
      closeModal();
    } catch {
      toast.error("Произошла ошибка при удалении пользователя");
    }
  };
  return (
    <Dialog open={opened} onOpenChange={handleClose}>
      <DialogClose onClick={handleClose} />
      <DialogContent>
        <div className="mb-6">
          <Title
            text="Вы действительно хотите удалить пользователя?"
            className="text-center font-bold"
            size="sm"
          />
        </div>
        <div className="flex justify-center gap-5">
          <Button onClick={handleDelete} variant={"destructive"}>
            Удалить
          </Button>
          <Button onClick={handleClose} variant={"outline"}>
            Отменить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
