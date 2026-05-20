import type { Metadata } from "next";
import { Ubuntu_Sans, Geist } from "next/font/google";
import "./globals.css";
import ClientProviders from "./Provider";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "TaskPilot",
  description: "Manage your tasks with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        suppressHydrationWarning
        className={cn("min-h-screen bg-background font-sans antialiased", ubuntuSans.className)}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
