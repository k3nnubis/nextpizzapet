import { Nunito } from "next/font/google";
import { AppToaster } from "@/shared/components/shared/app-toaster";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function BossRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body className={nunito.className}>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
