import { cn } from "@/shared/lib/utils";
import React from "react";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className }) => {
  return (
    <label
      title="Тема сайта"
      className={cn(
        "relative inline-block h-[2em] w-[3.5em] text-[17px]",
        className,
      )}
    >
      <input type="checkbox" className="peer h-0 w-0 opacity-0" />
      <span className='absolute top-0 right-0 bottom-0 left-0 cursor-pointer rounded-[30px] bg-[#f5f5f4] duration-300 ease-in-out peer-checked:bg-[#ff7f07] before:absolute before:bottom-[15%] before:left-1/10 before:h-[1.4em] before:w-[1.4em] before:rounded-[50%] before:bg-[#f4f4f5] before:shadow-(--shadow-theme-switcher) before:duration-300 before:ease-in-out before:content-[""] peer-checked:before:translate-x-full peer-checked:before:shadow-[inset_15px_-4px_0px_15px_#f4f4f5]'></span>
    </label>
  );
};
