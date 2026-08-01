import { Title } from "@/shared/components/shared";
import { UsersList } from "@/shared/components/shared/dashboard";
import { Api } from "@/shared/services/api-client";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Пользователи",
};
export default async function DashboardUsersPage() {
  const users = await Api.dashUsers.getUsers();
  return (
    <div className="w-full px-7 py-4">
      <Title text="Пользователи" size="lg" className="mb-4 font-extrabold" />
      <UsersList users={users} />
      
    </div>
  );
}
