import { getServerSession } from "next-auth";
import { authOptions } from "../constants/auth-options";

export const getUserSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.status === "BLOCKED" || session.user.invalidated) return null;
  return session.user;
};
