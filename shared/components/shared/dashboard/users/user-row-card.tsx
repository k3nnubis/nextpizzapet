import type { User } from "@/src/generated/prisma/client";

interface UserRowCardProps {
  data: User;
}

export function UserRowCard({ data }: UserRowCardProps) {
  return (
    <div className="flex gap-3">
      <p>{data.id}</p>
      <p>{data.fullName}</p>
      <p>{data.email}</p>
      <p>{data.role}</p>
      <p>{data.verified ? `${data.verified}` : "not verified"}</p>
      <p>{data.provider ? `${data.provider}` : "no provider"}</p>
      <p>{data.providerId ? `${data.providerId}` : "no providerID"}</p>
      <p>{new Date(data.createdAt).toLocaleString("ru-RU")}</p>
      <p>{new Date(data.updatedAt).toLocaleString("ru-RU")}</p>
    </div>
  );
}
