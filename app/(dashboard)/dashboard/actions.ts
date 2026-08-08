"use server";

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { sendEmail } from "@/shared/lib/send-email";
import { PasswordResetTemplate } from "@/shared/components/shared/email-templates";
import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

type UserRole = "USER" | "ADMIN";
type UserStatus = "ACTIVE" | "BLOCKED";

type UpdateUserBody = {
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
};

async function requireAdmin() {
  const session = await getUserSession();
  if (!session) throw new Error("Необходима авторизация администратора.");

  const admin = await prisma.user.findUnique({ where: { id: Number(session.id) } });
  if (!admin || admin.role !== "ADMIN" || admin.status !== "ACTIVE") {
    throw new Error("Недостаточно прав.");
  }

  return admin;
}

async function ensureAnotherActiveAdmin(targetUserId: number) {
  const activeAdmins = await prisma.user.count({
    where: { role: "ADMIN", status: "ACTIVE", id: { not: targetUserId } },
  });
  if (activeAdmins === 0) throw new Error("Нельзя отключить последнего активного администратора.");
}

async function writeAuditLog(
  actorId: number,
  targetUserId: number,
  action: string,
  details?: Record<string, string | number | boolean | null>,
) {
  await prisma.adminAuditLog.create({ data: { actorId, targetUserId, action, details } });
}

export async function editUserInfo(body: UpdateUserBody, userId: number) {
  const admin = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Пользователь не найден.");

  if (admin.id === userId && (body.role !== "ADMIN" || body.status !== "ACTIVE")) {
    throw new Error("Нельзя понизить или заблокировать собственную учётную запись.");
  }
  if (user.role === "ADMIN" && (body.role !== "ADMIN" || body.status !== "ACTIVE")) {
    await ensureAnotherActiveAdmin(userId);
  }

  const emailOwner = await prisma.user.findFirst({
    where: { email: body.email.trim().toLowerCase(), id: { not: userId } },
    select: { id: true },
  });
  if (emailOwner) throw new Error("Этот e-mail уже используется.");

  const changedEmail = user.email !== body.email.trim().toLowerCase();
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      role: body.role,
      status: body.status,
      verified: body.verified && !changedEmail ? user.verified ?? new Date() : null,
      ...(user.status !== body.status || user.role !== body.role || changedEmail
        ? { sessionVersion: { increment: 1 } }
        : {}),
    },
  });

  await writeAuditLog(admin.id, userId, "USER_UPDATED", {
    role: updated.role,
    status: updated.status,
    emailChanged: changedEmail,
    verified: Boolean(updated.verified),
  });
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath("/dashboard/users");
}

export async function resetUserPassword(password: string, userId: number) {
  const admin = await requireAdmin();
  if (password.length < 8) throw new Error("Пароль должен содержать минимум 8 символов.");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) throw new Error("Пользователь не найден.");

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashSync(password, 10), sessionVersion: { increment: 1 } },
  });
  await writeAuditLog(admin.id, userId, "PASSWORD_RESET");
  revalidatePath(`/dashboard/users/${userId}`);
}

export async function sendUserPasswordResetLink(userId: number) {
  const admin = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Пользователь не найден.");

  const token = randomUUID();
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } }),
    prisma.passwordResetToken.create({
      data: { userId, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    }),
  ]);
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail(user.email, "Ссылка для сброса пароля", PasswordResetTemplate({ fullName: user.fullName, resetUrl }));
  await writeAuditLog(admin.id, userId, "PASSWORD_RESET_LINK_SENT");
}

export async function setUserBlocked(userId: number, blocked: boolean) {
  const admin = await requireAdmin();
  if (admin.id === userId && blocked) throw new Error("Нельзя заблокировать собственную учётную запись.");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Пользователь не найден.");
  if (user.role === "ADMIN" && blocked) await ensureAnotherActiveAdmin(userId);

  await prisma.user.update({
    where: { id: userId },
    data: { status: blocked ? "BLOCKED" : "ACTIVE", sessionVersion: { increment: 1 } },
  });
  await writeAuditLog(admin.id, userId, blocked ? "USER_BLOCKED" : "USER_UNBLOCKED");
  revalidatePath(`/dashboard/users/${userId}`);
  revalidatePath("/dashboard/users");
}

export async function invalidateUserSessions(userId: number) {
  const admin = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) throw new Error("Пользователь не найден.");

  await prisma.user.update({ where: { id: userId }, data: { sessionVersion: { increment: 1 } } });
  await writeAuditLog(admin.id, userId, "SESSIONS_INVALIDATED");
  revalidatePath(`/dashboard/users/${userId}`);
}

export async function deleteDashboardUser(userId: number) {
  const admin = await requireAdmin();
  if (admin.id === userId) throw new Error("Нельзя удалить собственную учётную запись.");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Пользователь не найден.");
  if (user.role === "ADMIN") await ensureAnotherActiveAdmin(userId);

  await writeAuditLog(admin.id, userId, "USER_DELETED", { email: user.email, role: user.role });
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/users");
}
