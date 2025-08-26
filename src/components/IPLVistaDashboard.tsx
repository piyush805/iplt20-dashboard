"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useSmartPolling } from "@/hooks/useSmartPolling";
import BackgroundCarousel from "./BackgroundCarousel";
import LiveMatchesSection from "./sections/LiveMatchesSection";
import UpcomingMatchesSection from "./sections/UpcomingMatchesSection";

export default function IPLVistaDashboard() {
  const { livePayload, error } = useAppStore();
  const { startSmartPolling, stopPolling, isPolling } = useSmartPolling();

  // Smart polling with business logic
  useEffect(() => {
    // Start smart polling when component mounts
    startSmartPolling(15000); // 15 seconds interval

    // Cleanup: stop polling when component unmounts
    return () => {
      console.log("Dashboard unmounting, stopping polling");
      stopPolling();
    };
  }, [startSmartPolling, stopPolling]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Carousel */}
      <section className="relative h-96 overflow-hidden">
        <BackgroundCarousel />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70 z-[5]"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              IPL Vista
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto animate-fade-in">
              Experience the thrill of IPL T20 cricket with live scores, match
              schedules, and team standings
            </p>
            {isPolling && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm opacity-75">Live updates active</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Live Matches Section */}
        <section className="px-2">
          <LiveMatchesSection livePayload={livePayload} error={error} />
        </section>

        {/* Upcoming Matches Section */}
        <section className="px-2">
          <UpcomingMatchesSection livePayload={livePayload} />
        </section>

        {/* Quick Actions */}
        <section className="px-2">
          <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-elegant">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a
                href="/schedule"
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-glow text-center"
              >
                View Match Schedule
              </a>
              <a
                href="/points-table"
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-glow text-center"
              >
                Points Table
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
