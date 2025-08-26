"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "./Navigation";
import PollingStatusIndicator from "./PollingStatusIndicator";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>{children}</main>
        <PollingStatusIndicator />
      </div>
    </ThemeProvider>
  );
}
