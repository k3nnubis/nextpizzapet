import { cn } from "@/shared/lib/utils";
import { X } from "lucide-react";

interface ClearButtonProps {
  className?: string;
  onClick?: VoidFunction;
}

export function ClearButton({ className, onClick }: ClearButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-100", className)}
    >
      <X className="h-5 w-5" />
    </button>
  );
}
