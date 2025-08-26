"use client";

// src/app/points-table/page.tsx - Dedicated Points Table Page
import React, { useEffect, useState } from "react";
import PointsTableComponent from "@/components/ui/PointsTable";
import { PointsTable } from "@/types";

export default function PointsTablePage() {
  const [pointsData, setPointsData] = useState<PointsTable | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        setIsLoading(true);
        // For now, we'll use the fixture data directly
        const response = await fetch("/api/points");
        if (response.ok) {
          const data = await response.json();
          setPointsData(data);
        } else {
          throw new Error("Failed to fetch points data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch points data"
        );
        console.error("Points fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPointsData();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 max-w-container mx-auto text-center">
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
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-container mx-auto space-y-8">
        {isLoading && (
          <div className="bg-gradient-card rounded-xl p-12 text-center border border-border shadow-card">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Loading Points Table
            </h3>
            <p className="text-muted-foreground text-lg">
              Please wait while we fetch the latest standings...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-card">
            <div>
              <h3 className="font-semibold text-red-800">Data Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && pointsData ? (
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
          !isLoading && (
            <div className="bg-gradient-card rounded-xl p-12 text-center border border-border shadow-card">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Points Table Unavailable
              </h3>
              <p className="text-muted-foreground text-lg">
                Unable to load points table data at this time
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
