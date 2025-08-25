"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const pathname = usePathname();
  const { toggleTheme, isDark } = useTheme();

  const navItems = [
    { href: "/", label: "Dashboard", icon: "Dashboard" },
    { href: "/schedule", label: "Matches", icon: "Matches" },
    { href: "/points-table", label: "Points Table", icon: "Points" },
  ];

  return (
    <nav className="bg-card/50 backdrop-blur-md shadow-elegant border-b border-border sticky top-0 z-50 transition-all duration-300">
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
              <span className="text-2xl font-bold text-foreground">
                IPL <span className="text-secondary">Vista</span>
              </span>
              <div className="text-xs text-muted-foreground -mt-1">
                Live Cricket Dashboard
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 mr-3 backdrop-blur-sm"
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
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
                      ? "bg-primary/20 text-foreground shadow-glow ring-1 ring-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.icon}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
      >
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
      <div
        className={`absolute right-0 mt-2 w-48 bg-card/90 backdrop-blur-md rounded-xl shadow-elegant border border-border transition-all duration-300 z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="py-2">
          {items.map((item) => {
            const isActive = currentPath === item.href;
            const isExternal = item.href.startsWith("/api");

            return (
              <Link
                key={item.href}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                onClick={closeMenu}
                className={`block px-4 py-3 text-sm transition-all duration-300 rounded-lg mx-2 ${
                  isActive
                    ? "bg-primary text-white shadow-card font-medium"
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
