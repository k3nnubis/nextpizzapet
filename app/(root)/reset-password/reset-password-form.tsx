"use client";

import { Button, Input } from "@/shared/components/ui";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { applyPasswordReset } from "./actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) return toast.error("Пароли не совпадают");
    setPending(true);
    try {
      await applyPasswordReset(token, password);
      setComplete(true);
      toast.success("Пароль обновлён");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось обновить пароль");
    } finally {
      setPending(false);
    }
  };

  if (complete) {
    return (
      <div className="text-center">
        <p className="font-bold">Пароль успешно изменён.</p>
        <Button asChild className="mt-5">
          <Link href="/">Перейти на главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-2 block font-semibold">Новый пароль</label>
        <Input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type={visible ? "text" : "password"}
          minLength={8}
          required
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="mb-2 block font-semibold">Повторите пароль</label>
        <Input
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          type={visible ? "text" : "password"}
          minLength={8}
          required
          autoComplete="new-password"
        />
      </div>
      <Button type="button" variant="ghost" onClick={() => setVisible((value) => !value)}>
        {visible ? <EyeOff /> : <Eye />} {visible ? "Скрыть пароль" : "Показать пароль"}
      </Button>
      <Button className="w-full" type="submit" disabled={pending}>
        {pending && <LoaderCircle className="animate-spin" />}Сохранить новый пароль
      </Button>
    </form>
  );
}
