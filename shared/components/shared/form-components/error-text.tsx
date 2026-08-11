import { cn } from "@/shared/lib/utils";
import React from "react";

interface ErrorTextProps {
  text: string;
  className?: string;
}

export function ErrorText({ text, className }: ErrorTextProps) {
  return <p className={cn("text-sm text-red-500", className)}>{text}</p>;
}
