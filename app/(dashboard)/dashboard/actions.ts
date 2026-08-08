"use server";

import { prisma } from "@/prisma/prisma-client";
import { getAdminSession } from "@/shared/lib/get-admin-session";
import { UserUpdateInput } from "@/src/generated/prisma/models";
import { hashSync } from "bcrypt";
type UpdateUserBody = {
  fullName?: string;
  email?: string;
  password?: string;
};
export async function editUserInfo(body: UpdateUserBody, userId: number) {
  try {
    const isUserAdmin = await getAdminSession();
    if (!isUserAdmin) throw new Error("Пользователь не найден.");

    const findUser = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!findUser) throw new Error("Пользователь не найден.");

    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: body.fullName,
        email: body.email,
        ...(body.password?.trim() ? { password: hashSync(body.password, 10) } : {}),
      },
    });
  } catch (error) {
    console.log("ERROR [EDIT_USER_INFO]", error);
    throw error;
  }
}
