// src/app/schedule/page.tsx - Enhanced Schedule Page
import React from "react";
import { ScheduleResponse } from "@/server/types";
import { ScheduleRepository } from "@/server/repos/schedule.repo";
import { MemoryCache } from "@/lib/cache";
import EnhancedSchedule from "@/components/EnhancedSchedule";

export default async function SchedulePage() {
  let initialScheduleData: ScheduleResponse | null = null;
  let error: string | null = null;

  try {
    const cache = new MemoryCache();
    const scheduleRepo = new ScheduleRepository(cache);

    if (process.env.USE_DUMMY !== "0") {
      // Default to dummy if not explicitly '0'
      const fs = await import("fs/promises");
      const path = await import("path");
      const fixturePath = path.join(
        process.cwd(),
        "src/fixtures/schedule.json"
      );
      const raw = await fs.readFile(fixturePath, "utf8");
      initialScheduleData = JSON.parse(raw);
    } else {
      initialScheduleData = await scheduleRepo.getCachedOrScrape();
    }
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Failed to fetch schedule data";
    console.error("Server-side schedule fetch error:", err);

    // Fallback to fixture data on error
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const fixturePath = path.join(
        process.cwd(),
        "src/fixtures/schedule.json"
      );
      const raw = await fs.readFile(fixturePath, "utf8");
      initialScheduleData = JSON.parse(raw);
      error = null; // Clear error if we have fallback data
    } catch (fallbackErr) {
      console.error("Failed to load fallback schedule data:", fallbackErr);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 max-w-container mx-auto">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Match Schedule
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Complete match schedule with live updates, team details, and venue
              information
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-container mx-auto">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-6 mb-8 shadow-card">
            <div className="flex items-center gap-3">
              <div className="text-red-400 text-xl">⚠</div>
              <div>
                <h3 className="font-semibold text-red-300">Data Error</h3>
                <p className="text-red-200 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Schedule Component */}
        <div className="animate-fade-in">
          <EnhancedSchedule initialData={initialScheduleData} />
        </div>
      </section>
    </div>
  );
}
