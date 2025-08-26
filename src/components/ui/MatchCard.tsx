"use client";

import { Match, LiveScore } from "@/types";
import { getMatchStatus, isMatchLive } from "@/utils/time";
import { getTeamConfig } from "@/utils/teams";
import Image from "next/image";

interface MatchCardProps {
  match: Match;
  liveScore?: LiveScore | null;
  className?: string;
}

export default function MatchCard({
  match,
  liveScore,
  className = "",
}: MatchCardProps) {
  const { displayStatus, timeInfo } = getMatchStatus(
    match.startTimeUTC,
    match.status
  );
  const isLive = isMatchLive(match.status);

  const team1Config = getTeamConfig(match.teams[0]);
  const team2Config = getTeamConfig(match.teams[1]);

  // Handle TBD (To Be Determined) matches
  if (
    (match.teams[0] as string) === "TBD" ||
    (match.teams[1] as string) === "TBD"
  ) {
    return (
      <div
        className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 ${className}`}
      >
        <div className="text-center text-slate-600 dark:text-slate-400">
          <div className="text-lg font-semibold mb-2">Playoff Match</div>
          <div className="text-sm font-medium mb-2">{match.matchNumber}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Teams to be determined after previous round
          </div>
        </div>
      </div>
    );
  }

  // Safety check - if team configs are not found, use fallback values
  if (!team1Config || !team2Config) {
    console.warn(
      `Team config not found for teams: ${match.teams[0]}, ${match.teams[1]}`
    );
    return (
      <div
        className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 ${className}`}
      >
        <div className="text-center text-slate-600 dark:text-slate-400">
          <div className="text-lg font-semibold mb-2">Match Details</div>
          <div className="text-sm">
            {match.teams[0]} vs {match.teams[1]}
          </div>
          <div className="text-xs mt-2">Team configuration not available</div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide";

    switch (match.status) {
      case "LIVE":
        return `${baseClasses} bg-red-500 text-white animate-pulse shadow-lg`;
      case "COMPLETED":
        return `${baseClasses} bg-green-500 text-white`;
      case "SCHEDULED":
        return `${baseClasses} bg-blue-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  const getTeamScore = (teamId: string) => {
    if (!liveScore) return null;

    const innings = liveScore.innings.find(
      (inning) => inning.battingTeam === teamId
    );
    if (!innings) return null;

    return (
      <div className="text-right">
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {innings.runs}/{innings.wickets}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {innings.overs} overs
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {/* Header with match info */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90 font-medium">
            {match.matchNumber || "Match"}
          </span>
          <div className={getStatusBadge()}>{displayStatus}</div>
        </div>

        <div className="text-center">
          <div className="text-sm opacity-90 mb-1">
            {match.venue.name}
            {match.venue.city && `, ${match.venue.city}`}
          </div>
          <div className="text-xs opacity-75">{timeInfo}</div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Team 1 */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: `${team1Config.primaryColor}15` }}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20">
                <Image
                  src={team1Config.logo}
                  alt={team1Config.name}
                  fill
                  className="object-contain p-1"
                  style={{ backgroundColor: team1Config.primaryColor }}
                />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  {team1Config.name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {team1Config.shortName}
                </div>
              </div>
            </div>
            {getTeamScore(match.teams[0])}
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <div className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold text-sm px-3 py-1 rounded-full">
              VS
            </div>
          </div>

          {/* Team 2 */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: `${team2Config.primaryColor}15` }}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20">
                <Image
                  src={team2Config.logo}
                  alt={team2Config.name}
                  fill
                  className="object-contain p-1"
                  style={{ backgroundColor: team2Config.primaryColor }}
                />
              </div>
              <div>
                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  {team2Config.name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {team2Config.shortName}
                </div>
              </div>
            </div>
            {getTeamScore(match.teams[1])}
          </div>
        </div>

        {/* Live Score Details */}
        {liveScore && isLive && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
            <div className="grid grid-cols-2 gap-4 text-center">
              {liveScore.currentOver && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">
                    CURRENT OVER
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {liveScore.currentOver}
                  </div>
                </div>
              )}
              {liveScore.target && (
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-xs text-orange-600 font-medium">
                    TARGET
                  </div>
                  <div className="text-lg font-bold text-orange-800">
                    {liveScore.target}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toss Information */}
        {match.toss && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              TOSS
            </div>
            <div className="text-sm text-slate-800 dark:text-slate-200">
              {match.toss}
            </div>
          </div>
        )}

        {/* Result */}
        {liveScore?.resultText && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-center text-green-800 dark:text-green-300 font-medium">
              {liveScore.resultText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
