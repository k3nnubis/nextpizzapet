"use client";

import { AppToaster } from "@/shared/components/shared/app-toaster";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <AppToaster />
      <NextTopLoader color="var(--primary)" />
    </>
  );
}
