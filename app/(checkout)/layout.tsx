import { Container, Header } from "@/shared/components/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Good Food | Корзина",
  description: "Пет проектик",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#F4F1EE]">
      <Container>
        <Header hasSearch={false} hasCart={false} className="border-gray-200" />
        {children}
      </Container>
    </main>
  );
}
