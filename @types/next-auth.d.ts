// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type { UserRole, UserStatus } from "@/src/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name: string;
      image: string;
      status: UserStatus;
      invalidated: boolean;
    };
  }

  interface User extends DefaultUser {
    id: number;
    role: UserRole;
    status: UserStatus;
    sessionVersion: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    status: UserStatus;
    sessionVersion: number;
    invalidated: boolean;
  }
}
