"use server";
import { prisma } from "@/prisma/prisma-client";
import { VerificationTemplate } from "@/shared/components/shared";
import { sendEmail } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { UserCreateInput, UserUpdateInput } from "@/src/generated/prisma/models";
import { hashSync } from "bcrypt";

export async function updateUserInfo(body: UserUpdateInput) {
  try {
    const currentUser = await getUserSession();
    if (!currentUser) throw new Error("Пользователь не найден.");

    const findUser = await prisma.user.findFirst({
      where: { id: Number(currentUser.id) },
    });
    if (!findUser) throw new Error("Пользователь не найден.");

    await prisma.user.update({
      where: { id: Number(currentUser.id) },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password ? hashSync(body.password as string, 10) : findUser.password,
      },
    });
  } catch (error) {
    console.log("ERROR [UPDATE_USER_INFO]", error);
    throw error;
  }
}
export async function registerUser(body: UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: { email: body.email },
    });
    if (user) {
      if (!user.verified) throw new Error("Почта не подтверждена.");
      throw new Error("Пользователь с таким email уже зарегистрирован.");
    }

    const newUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const verCode = Math.floor(10000 + Math.random() * 90000).toString();

    await prisma.verificationCode.create({
      data: {
        code: verCode,
        userId: newUser.id,
      },
    });

    await sendEmail(
      newUser.email,
      "Next Pizza / Подтверждение регистрации",
      VerificationTemplate({ code: verCode }),
    );
  } catch (error) {
    console.log("ERROR [REGISTER_USER]", error);
    throw error;
  }
}
