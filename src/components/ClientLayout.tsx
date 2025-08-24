"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Navigation />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </ThemeProvider>
  );
}
