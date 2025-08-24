"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { clientFetch } from "@/lib/fetcher";
import { PointsTable } from "@/server/types";
import MatchCard from "@/components/ui/MatchCard";
import PointsTableComponent from "@/components/ui/PointsTable";

export default function EnhancedDashboard() {
  const {
    livePayload,
    points,
    setPoints,
    isLoading,
    setLoading,
    error,
    setError,
  } = useAppStore();

  // Fetch points table on component mount
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clientFetch<PointsTable>("/api/points");
        setPoints(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch points");
      } finally {
        setLoading(false);
      }
    };

    if (!points) {
      fetchPoints();
    }
  }, [points, setPoints, setLoading, setError]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Live Match - Equal width with points table */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          🏏 Live Match
          {livePayload?.match?.status === "LIVE" && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {livePayload?.match ? (
          <MatchCard
            match={livePayload.match}
            liveScore={livePayload.live}
            className="mb-6"
          />
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🏏</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Live Match
            </h3>
            <p className="text-slate-500">
              Check back during match hours for live updates
            </p>
          </div>
        )}

        {/* Next Match Preview */}
        {livePayload?.next && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              📅 Next Match
            </h3>
            <MatchCard
              match={livePayload.next}
              className="opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>

      {/* Points Table - Equal width with live match */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          📊 Points Table
        </h2>

        {isLoading && !points ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : points ? (
          <PointsTableComponent data={points} />
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Points Table Unavailable
            </h3>
            <p className="text-slate-500">Unable to load points table data</p>
          </div>
        )}
      </div>
    </div>
  );
}
