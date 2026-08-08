"use server";

import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcrypt";

export async function applyPasswordReset(token: string, password: string) {
  if (password.length < 8) throw new Error("Пароль должен содержать минимум 8 символов.");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw new Error("Ссылка недействительна или уже истекла.");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashSync(password, 10), sessionVersion: { increment: 1 } },
    }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);
}
