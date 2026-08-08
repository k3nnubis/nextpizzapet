import { prisma } from "@/prisma/prisma-client";
import { DashboardContainer, DashboardHeader, DashboardMenu } from "@/shared/components/shared/dashboard";
import { getUserSession } from "@/shared/lib/get-user-session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Административная панель",
    default: "Good Food | Административная панель",
  },
  description: "Пет проектик",
};

export default async function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUserSession();

  if (!session) {
    return redirect("/not-auth");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: Number(session?.id),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  if (!user) return redirect("/not-auth");
  return (
    <main className="min-h-screen bg-[#f3faff]">
      <DashboardContainer>
        <DashboardHeader />
        <div className="flex min-w-0 flex-col md:flex-row">
          <DashboardMenu />
          {children}
        </div>
      </DashboardContainer>
    </main>
  );
}
