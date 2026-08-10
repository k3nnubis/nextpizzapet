"use client";

import React from "react";
import {
  Folder,
  House,
  Leaf,
  Package,
  ShoppingCart,
  Users,
  NotebookText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}

function isSubPath(subPath: string, parentPath: string) {
  if (subPath === "/dashboard" && parentPath === "/dashboard") {
    return true;
  }

  return subPath !== "/dashboard" && (subPath === parentPath || parentPath.startsWith(subPath));
}

const items = [
  {
    text: "Главная",
    icon: <House size={16} />,
    href: "/dashboard",
  },
  {
    text: "Пользователи",
    icon: <Users size={16} />,
    href: "/dashboard/users",
  },
  {
    text: "Категории",
    icon: <Folder size={16} />,
    href: "/dashboard/categories",
  },
  {
    text: "Продукты",
    icon: <Package size={16} />,
    href: "/dashboard/products",
  },
  {
    text: "Ингредиенты",
    icon: <Leaf size={16} />,
    href: "/dashboard/ingredients",
  },
  {
    text: "Заказы",
    icon: <ShoppingCart size={16} />,
    href: "/dashboard/orders",
  },
  {
    text: "Документы",
    icon: <NotebookText size={16} />,
    href: "/dashboard/documents",
  },
];

export const DashboardMenu: React.FC<Props> = ({ className }) => {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b bg-white md:min-h-[calc(100vh-4rem)] md:w-[200px] md:shrink-0 md:border-r md:border-b-0">
      <nav
        className={cn(
          "flex gap-2 overflow-x-auto px-3 py-3 text-sm font-medium md:grid md:items-start md:overflow-visible md:px-4 md:py-5",
          className,
        )}
      >
        {items.map((item) => (
          <Link
            key={item.text}
            className={cn(
              "hover:text-primary hover:bg-accent flex h-[35px] shrink-0 gap-3 rounded-[8px] px-3 py-2 text-gray-900 transition-all",
              {
                "bg-gray-200": isSubPath(item.href, pathname),
              },
            )}
            href={item.href}
          >
            {item.icon}
            {item.text}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
