import { cn } from "@/shared/lib/utils";

interface DashboardContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function DashboardContainer({ className, children }: DashboardContainerProps) {
  return <div className={cn("mx-auto", className)}>{children}</div>;
}
