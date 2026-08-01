"use client";

import React from "react";
import { Folder, House, LayoutDashboard, Leaf, Package, ShoppingCart, Users } from "lucide-react";
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
    text: "Вариации",
    icon: <LayoutDashboard size={16} />,
    href: "/dashboard/product-items",
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
];

export const DashboardMenu: React.FC<Props> = ({ className }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen max-w-[200px] border-r bg-white">
      <nav className={cn("grid items-start gap-2 px-4 py-5 text-sm font-medium", className)}>
        {items.map((item) => (
          <Link
            key={item.text}
            className={cn(
              "hover:text-primary hover:bg-accent flex h-[35px] gap-3 rounded-[8px] px-3 py-2 text-gray-900 transition-all",
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
    </div>
  );
};
