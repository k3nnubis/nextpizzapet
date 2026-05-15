import { cn } from '@/lib/utils';
import React from 'react';

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className }) => {
  return (
    <label title='Тема сайта' className={cn('relative inline-block w-[3.5em] h-[2em] text-[17px]', className)} >
      <input type="checkbox" className='peer opacity-0 w-0 h-0' />
      <span className='absolute cursor-pointer top-0 left-0 right-0 bottom-0 duration-300 ease-in-out rounded-[30px] bg-[#f5f5f4] peer-checked:bg-[#ff7f07] before:absolute before:content-[""] before:h-[1.4em] before:w-[1.4em] before:bottom-[15%] before:left-1/10 before:bg-[#f4f4f5] before:duration-300 before:ease-in-out before:rounded-[50%] before:shadow-(--shadow-theme-switcher) peer-checked:before:translate-x-full peer-checked:before:shadow-[inset_15px_-4px_0px_15px_#f4f4f5]'></span>
    </label >
  );
};
