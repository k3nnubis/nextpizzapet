"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
          fontWeight: 600,
        },
        success: {
          iconTheme: {
            primary: "var(--primary)",
            secondary: "var(--primary-foreground)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--destructive)",
            secondary: "var(--primary-foreground)",
          },
        },
      }}
    />
  );
}

