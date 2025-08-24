"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SimpleNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: "Dashboard" },
    { href: "/schedule", label: "Matches", icon: "Matches" },
    { href: "/points-table", label: "Points Table", icon: "Points" },
  ];

  return (
    <nav className="bg-gradient-primary/95 backdrop-blur-md shadow-elegant border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8 max-w-container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* IPL Vista Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-hero p-2.5 rounded-xl shadow-glow group-hover:shadow-elegant transition-all duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-white">
                IPL <span className="text-secondary">Vista</span>
              </span>
              <div className="text-xs text-white/80 -mt-1">
                Live Cricket Dashboard
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isExternal = item.href.startsWith("/api");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    isActive
                      ? "bg-white/20 text-white shadow-glow ring-1 ring-white/30"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.icon}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileNavigation items={navItems} currentPath={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileNavigation({
  items,
  currentPath,
}: {
  items: Array<{ href: string; label: string; icon: string }>;
  currentPath: string;
}) {
  return (
    <div className="relative group">
      <button className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-xl shadow-elegant border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="py-2">
          {items.map((item) => {
            const isActive = currentPath === item.href;
            const isExternal = item.href.startsWith("/api");

            return (
              <Link
                key={item.href}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                className={`block px-4 py-3 text-sm transition-all duration-300 rounded-lg mx-2 ${
                  isActive
                    ? "bg-gradient-primary text-white shadow-card"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
