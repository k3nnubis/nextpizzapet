"use client";
import { cn } from "@/shared/lib/utils";
import React, { Suspense } from "react";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ProfileButton } from "./profile-button";
import { AuthModal } from "./modals";
import { Button } from "../ui";
import { useSession } from "next-auth/react";
import { LayoutDashboard } from "lucide-react";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

const SearchParamsToast = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    let toastMessage = "";
    if (searchParams.has("paid")) {
      toastMessage = "Оплата прошла успешно! Информация отправлена на почту";
    }
    if (searchParams.has("verified")) {
      toastMessage = "Почта успешно подтверждена";
    }
    if (toastMessage) {
      setTimeout(() => {
        router.replace("/");
        toast.success(toastMessage, { duration: 3000 });
      }, 1000);
    }
  }, [router, searchParams]);

  return null;
};

export const Header: React.FC<Props> = ({ hasSearch = true, hasCart = true, className }) => {
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const { data: session } = useSession();

  return (
    <header className={cn("border-b", className)}>
      <Suspense fallback={null}>
        <SearchParamsToast />
      </Suspense>
      <Container className="flex items-center justify-between py-8">
        {/* Левая часть */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <div>
              <h1 className="text-2xl font-black uppercase select-none">GOOD FOOD</h1>
              <p className="text-sm leading-3 text-gray-400 select-none">вкусней уже некуда</p>
            </div>
          </div>
        </Link>
        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          <AuthModal
            open={openAuthModal}
            onClose={() => {
              setOpenAuthModal(false);
            }}
          />

          {session?.user.role === "ADMIN" && (
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <LayoutDashboard size={16} />
                <span className="hidden lg:inline">Админ-панель</span>
                <span className="sr-only lg:hidden">Открыть административную панель</span>
              </Link>
            </Button>
          )}

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}

          {/* <ThemeSwitch /> */}
        </div>
      </Container>
    </header>
  );
};
