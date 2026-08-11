"use client";

import { Button } from "@/shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { ChevronDown, ExternalLink, LogOut, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  className?: string;
  user: {
    fullName: string;
    email: string;
  };
}

const sections = [
  { path: "/dashboard/users", title: "Пользователи" },
  { path: "/dashboard/categories", title: "Категории" },
  { path: "/dashboard/products", title: "Продукты" },
  { path: "/dashboard/ingredients", title: "Ингредиенты" },
  { path: "/dashboard/orders", title: "Заказы" },
  { path: "/dashboard/documents", title: "Документы" },
];

function getSectionTitle(pathname: string) {
  return sections.find(({ path }) => pathname.startsWith(path))?.title ?? "Обзор";
}

function getInitials(fullName: string) {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials.toUpperCase() || "GF";
}

export function DashboardHeader({ className, user }: Props) {
  const pathname = usePathname();
  const sectionTitle = getSectionTitle(pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white/95 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-white/85",
        className,
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:px-5 lg:px-6">
        <Link
          href="/dashboard"
          className="group flex shrink-0 flex-col items-start leading-none outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Good Food — главная страница панели управления"
        >
          <span className="text-lg font-black tracking-tight select-none sm:text-xl">
            GOOD <span className="text-primary">FOOD</span>
          </span>
          <span className="text-muted-foreground mt-1 hidden text-[10px] font-bold tracking-[0.12em] uppercase select-none sm:block">
            Панель управления
          </span>
        </Link>

        <div className="mx-1 hidden h-8 w-px bg-border sm:block" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold sm:text-base">{sectionTitle}</p>
          <p className="text-muted-foreground hidden text-xs lg:block">Управление магазином Good Food</p>
        </div>

        <Button asChild variant="outline" size="sm" className="px-2.5 sm:px-3">
          <Link href="/">
            <ExternalLink aria-hidden="true" />
            <span className="hidden sm:inline">На сайт</span>
            <span className="sr-only sm:hidden">Перейти на сайт</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 max-w-52 gap-2 px-1.5 sm:px-2"
              aria-label={`Открыть меню администратора ${user.fullName}`}
            >
              <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold">
                {getInitials(user.fullName)}
              </span>
              <span className="hidden min-w-0 text-left md:block">
                <span className="block truncate text-sm font-semibold">{user.fullName}</span>
                <span className="text-muted-foreground block text-xs font-normal">Администратор</span>
              </span>
              <ChevronDown className="text-muted-foreground hidden size-4 md:block" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <span className="block truncate font-semibold">{user.fullName}</span>
              <span className="text-muted-foreground block truncate text-xs">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound />
                Личный кабинет
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => void signOut({ callbackUrl: "/" })}
            >
              <LogOut />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
