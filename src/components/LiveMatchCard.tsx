"use client";

import { useAppStore } from "@/store/useAppStore";
import { getMatchStatus } from "@/utils/time";

export default function LiveMatchCard() {
  const { livePayload, isLoading, error } = useAppStore();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Live Data
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!livePayload?.match) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          No Live Match
        </h3>
        <p className="text-slate-600">No matches are currently live.</p>
      </div>
    );
  }

  const { match, live } = livePayload;
  const { displayStatus, timeInfo } = getMatchStatus(
    match.startTimeUTC,
    match.status
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">{match.matchNumber}</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              displayStatus === "LIVE"
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white/20 text-white"
            }`}
          >
            {displayStatus}
          </span>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold mb-1">
            {match.teams[0]} vs {match.teams[1]}
          </h3>
          <p className="text-sm opacity-90">
            {match.venue.name}, {match.venue.city}
          </p>
          <p className="text-xs opacity-75 mt-1">{timeInfo}</p>
        </div>
      </div>

      {/* Live Score */}
      {live && (
        <div className="p-4">
          <div className="space-y-3">
            {live.innings.map((innings, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-800">
                      {innings.battingTeam}
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {innings.runs}/{innings.wickets}
                    </div>
                    <div className="text-sm text-slate-600">
                      {innings.overs} overs
                    </div>
                  </div>
                </div>

                {live.target && index === 1 && (
                  <div className="text-right">
                    <div className="text-sm text-slate-600">Need</div>
                    <div className="text-lg font-bold text-orange-600">
                      {live.target - innings.runs} runs
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Over & Target */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
            {live.currentOver && (
              <span className="text-slate-600">
                Current Over:{" "}
                <span className="font-medium">{live.currentOver}</span>
              </span>
            )}
            {live.target && (
              <span className="text-slate-600">
                Target: <span className="font-medium">{live.target}</span>
              </span>
            )}
          </div>

          {/* Result Text */}
          {live.resultText && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-medium text-center">
                {live.resultText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Toss Info */}
      {match.toss && (
        <div className="px-4 pb-4">
          <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
            <strong>Toss:</strong> {match.toss}
          </div>
        </div>
      )}
    </div>
  );
}
