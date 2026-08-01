"use server";

import { prisma } from "@/prisma/prisma-client";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/dashboard/users");
}
