import { getTeamConfig } from "@/utils/teams";
import Image from "next/image";
import { PointsTableRowProps } from "@/types";

export default function PointsTableRow({
  team,
  index,
  totalTeams,
}: PointsTableRowProps) {
  const teamConfig = getTeamConfig(team.team);
  const position = index + 1;

  // Skip rendering if team config is not found
  if (!teamConfig) {
    console.warn(`Team config not found for team: ${team.team}`);
    return null;
  }

  const getPositionBadge = (position: number, totalTeams: number) => {
    if (position <= 4) {
      return "bg-green-500/20 text-green-400 border-green-500/40";
    }
    if (position >= totalTeams - 1) {
      return "bg-red-500/20 text-red-400 border-red-500/40";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  const getRecentFormColor = (result: string) => {
    switch (result) {
      case "W":
        return "text-green-500";
      case "L":
        return "text-red-500";
      case "N":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <tr className="hover:bg-muted/20 transition-colors duration-200">
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getPositionBadge(
            position,
            totalTeams
          )}`}
        >
          {position}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src={teamConfig.logo}
              alt={teamConfig.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {teamConfig.name}
            </div>
            <div className="text-sm text-muted-foreground">{team.team}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center font-semibold">{team.played}</td>
      <td className="px-4 py-4 text-center font-semibold text-green-600">
        {team.won}
      </td>
      <td className="px-4 py-4 text-center font-semibold text-red-600">
        {team.lost}
      </td>
      <td className="px-4 py-4 text-center font-mono">
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            team.nrr > 0
              ? "bg-green-500/20 text-green-600"
              : team.nrr < 0
              ? "bg-red-500/20 text-red-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {team.nrr.toFixed(3)}
        </span>
      </td>
      <td className="px-4 py-4 text-center font-mono text-sm">
        {team.for.runs}/{team.for.overs.toFixed(1)}
      </td>
      <td className="px-4 py-4 text-center font-mono text-sm">
        {team.against.runs}/{team.against.overs.toFixed(1)}
      </td>
      <td className="px-4 py-4 text-center">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold text-lg">
          {team.points}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-1 justify-center">
          {team.form && team.form.length > 0 ? (
            team.form.slice(-5).map((result: string, idx: number) => (
              <span
                key={idx}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRecentFormColor(
                  result
                )} bg-muted/20`}
              >
                {result}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      </td>
    </tr>
  );
}
