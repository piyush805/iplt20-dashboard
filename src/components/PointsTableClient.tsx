"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { clientFetch } from "@/lib/fetcher";
import { PointsTable } from "@/server/types";

export default function PointsTableClient() {
  const { points, setPoints, isLoading, setLoading, error, setError } =
    useAppStore();

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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Points Table
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading || !points) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-slate-50 border-b">
          <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <div className="h-4 bg-slate-200 rounded w-8 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
        <h3 className="text-xl font-bold">{points.season} Points Table</h3>
        <p className="text-sm opacity-90 mt-1" suppressHydrationWarning>
          Updated:{" "}
          {new Date(points.updatedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-600 uppercase">
                Pos
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-600 uppercase">
                Team
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-600 uppercase text-center">
                P
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-600 uppercase text-center">
                W
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-600 uppercase text-center">
                L
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-600 uppercase text-center">
                NRR
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-600 uppercase text-center">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {points.rows.map((team, index) => (
              <tr
                key={team.team}
                className={`border-b hover:bg-slate-50 ${
                  index < 4
                    ? "bg-green-50"
                    : index >= points.rows.length - 2
                    ? "bg-red-50"
                    : ""
                }`}
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index < 4
                        ? "bg-green-100 text-green-800"
                        : index >= points.rows.length - 2
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {team.team}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900">
                      {team.team}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-slate-700">
                  {team.played}
                </td>
                <td className="px-4 py-3 text-center text-green-600 font-medium">
                  {team.won}
                </td>
                <td className="px-4 py-3 text-center text-red-600 font-medium">
                  {team.lost}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`font-medium ${
                      team.nrr >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {team.nrr >= 0 ? "+" : ""}
                    {team.nrr.toFixed(3)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-lg text-slate-900">
                    {team.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-50 border-t text-xs text-slate-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Playoff Qualification</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Elimination Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
