import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { DeleteUserAgreement } from "./users";
import React from "react";

interface Props {
  className?: string;
}

export const DashboardHeader: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn("border-b bg-white", className)}>
      <div className="flex items-center justify-between px-8 py-4">
        {/* Левая часть */}
        <Link href="/">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-black uppercase select-none">GOOD FOOD</h1>
            <p className="text-s font-bold text-black select-none">Административная панель</p>
          </div>
        </Link>
      </div>
      <DeleteUserAgreement />
    </header>
  );
};
