"use client";

import { PointsTable, PointsRow } from "@/server/types";
import { getTeamConfig } from "@/utils/teams";
import Image from "next/image";

interface PointsTableProps {
  data: PointsTable;
  className?: string;
}

export default function PointsTableComponent({
  data,
  className = "",
}: PointsTableProps) {
  const getPositionBadge = (position: number, totalTeams: number) => {
    if (position <= 4) {
      return "bg-green-500/20 text-green-400 border-green-500/40";
    }
    if (position >= totalTeams - 1) {
      return "bg-red-500/20 text-red-400 border-red-500/40";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div
      className={`bg-card rounded-xl shadow-lg overflow-hidden border border-border ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{data.season}</h2>
            <p className="text-purple-100 text-sm">Points Table</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90" suppressHydrationWarning>
              Updated:{" "}
              {new Date(data.updatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20 border-b-2 border-border">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Pos
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Team
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                P
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                W
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                L
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                NRR
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                FOR
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                AGAINST
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                PTS
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                RECENT FORM
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.rows.map((team: PointsRow, index: number) => {
              const teamConfig = getTeamConfig(team.team);
              const position = index + 1;

              // Skip rendering if team config is not found
              if (!teamConfig) {
                console.warn(`Team config not found for team: ${team.team}`);
                return null;
              }

              return (
                <tr
                  key={team.team}
                  className="hover:bg-muted/20 transition-colors duration-200"
                >
                  {/* Position */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 ${getPositionBadge(
                          position,
                          data.rows.length
                        )}`}
                      >
                        {position}
                      </span>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white/10">
                        <Image
                          src={teamConfig.logo}
                          alt={teamConfig.name}
                          fill
                          className="object-contain p-1"
                          style={{ backgroundColor: teamConfig.primaryColor }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {teamConfig.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {teamConfig.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Played */}
                  <td className="px-4 py-4 text-center">
                    <span className="font-medium text-foreground">
                      {team.played}
                    </span>
                  </td>

                  {/* Won */}
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-green-400">{team.won}</span>
                  </td>

                  {/* Lost */}
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-red-400">{team.lost}</span>
                  </td>

                  {/* Net Run Rate */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`font-bold ${
                        team.nrr >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {team.nrr >= 0 ? "+" : ""}
                      {team.nrr.toFixed(3)}
                    </span>
                  </td>

                  {/* For (Runs/Overs) */}
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm">
                      <div className="font-bold text-foreground">
                        {team.for.runs}/{team.for.overs.toFixed(1)}
                      </div>
                    </div>
                  </td>

                  {/* Against (Runs/Overs) */}
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm">
                      <div className="font-bold text-foreground">
                        {team.against.runs}/{team.against.overs.toFixed(1)}
                      </div>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-foreground">
                      {team.points}
                    </span>
                  </td>

                  {/* Recent Form */}
                  <td className="px-4 py-4 text-center">
                    {team.form && team.form.length > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        {team.form.slice(-5).map((result, idx) => (
                          <span
                            key={idx}
                            className={`w-3 h-3 rounded-full ${
                              result === "W"
                                ? "bg-green-400"
                                : result === "L"
                                ? "bg-red-400"
                                : "bg-muted-foreground"
                            }`}
                            title={
                              result === "W"
                                ? "Won"
                                : result === "L"
                                ? "Lost"
                                : "No Result"
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-muted/20 px-6 py-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500/40 rounded"></div>
            <span>Playoff Qualification (Top 4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/20 border border-red-500/40 rounded"></div>
            <span>Elimination Zone</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span>
              <strong>P</strong> - Played
            </span>
            <span>
              <strong>W</strong> - Won
            </span>
            <span>
              <strong>L</strong> - Lost
            </span>
            <span>
              <strong>NRR</strong> - Net Run Rate
            </span>
            <span>
              <strong>PTS</strong> - Points
            </span>
            <span>
              <strong>FOR</strong> - Runs Scored/Overs
            </span>
            <span>
              <strong>AGAINST</strong> - Runs Conceded/Overs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
