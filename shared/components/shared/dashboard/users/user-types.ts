import type { User } from "@/src/generated/prisma/client";

export type DashboardUser = Pick<
  User,
  "id" | "fullName" | "email" | "role" | "status" | "verified" | "lastLoginAt" | "createdAt"
>;
