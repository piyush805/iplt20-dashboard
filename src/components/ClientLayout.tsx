"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import SimpleNavigation from "@/components/SimpleNavigation";
import { Suspense } from "react";

function NavigationWithTheme() {
  // This will be loaded after hydration
  return <SimpleNavigation />;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Suspense fallback={<SimpleNavigation />}>
        <NavigationWithTheme />
      </Suspense>
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </ThemeProvider>
  );
}
