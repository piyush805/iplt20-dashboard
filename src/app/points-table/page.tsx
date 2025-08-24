// src/app/points-table/page.tsx - Dedicated Points Table Page
import React from "react";
import { PointsRepository } from "@/server/repos/points.repo";
import { MemoryCache } from "@/lib/cache";
import PointsTableComponent from "@/components/ui/PointsTable";

export default async function PointsTablePage() {
  let pointsData = null;
  let error = null;

  try {
    const cache = new MemoryCache();
    const pointsRepo = new PointsRepository(cache);

    if (process.env.USE_DUMMY !== "0") {
      // Default to dummy if not explicitly '0'
      const fs = await import("fs/promises");
      const path = await import("path");
      const fixturePath = path.join(process.cwd(), "src/fixtures/points.json");
      const raw = await fs.readFile(fixturePath, "utf8");
      pointsData = JSON.parse(raw);
    } else {
      pointsData = await pointsRepo.getCachedOrScrape();
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch points data";
    console.error("Server-side points fetch error:", err);

    // Fallback to fixture data on error
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const fixturePath = path.join(process.cwd(), "src/fixtures/points.json");
      const raw = await fs.readFile(fixturePath, "utf8");
      pointsData = JSON.parse(raw);
      error = null; // Clear error if we have fallback data
    } catch (fallbackErr) {
      console.error("Failed to load fallback points data:", fallbackErr);
    }
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 max-w-container mx-auto">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              IPL Points Table
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Current standings and team performance in IPL T20 2024
            </p>
          </div>
        </div>
      </section>

      {/* Points Table Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-container mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-card">
            <div className="flex items-center gap-3">
              <div className="text-red-500 text-xl">⚠</div>
              <div>
                <h3 className="font-semibold text-red-800">Data Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {pointsData ? (
          <div className="animate-fade-in">
            <PointsTableComponent data={pointsData} />

            {/* Additional Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-card rounded-xl p-6 border border-border shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Playoff Race
                </h3>
                <p className="text-muted-foreground text-sm">
                  Top 4 teams qualify for playoffs. Current leaders are
                  competing for the championship.
                </p>
              </div>

              <div className="bg-gradient-card rounded-xl p-6 border border-border shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Net Run Rate
                </h3>
                <p className="text-muted-foreground text-sm">
                  NRR is crucial for playoff qualification when teams have equal
                  points.
                </p>
              </div>

              <div className="bg-gradient-card rounded-xl p-6 border border-border shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Live Updates
                </h3>
                <p className="text-muted-foreground text-sm">
                  Points table updates automatically after each match
                  completion.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-card rounded-xl p-12 text-center border border-border shadow-card">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Points Table Unavailable
            </h3>
            <p className="text-muted-foreground text-lg">
              Unable to load points table data at this time
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
