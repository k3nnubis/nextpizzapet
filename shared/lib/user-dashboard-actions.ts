"use server";

import { deleteDashboardUser } from "@/app/(dashboard)/dashboard/actions";

export async function deleteUser(id: number) {
  return deleteDashboardUser(id);
}
