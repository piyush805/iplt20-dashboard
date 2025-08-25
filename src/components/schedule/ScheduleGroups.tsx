import MatchCard from "@/components/ui/MatchCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { ScheduleGroupsProps } from "@/types";

export default function ScheduleGroups({
  groupedMatches,
}: ScheduleGroupsProps) {
  const statusOrder = ["LIVE", "SCHEDULED", "COMPLETED"] as const;

  return (
    <div className="space-y-8">
      {statusOrder.map((status) => {
        const matches = groupedMatches[status];
        if (matches.length === 0) return null;

        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={status} />
              <h3 className="text-xl font-semibold text-foreground">
                {status.charAt(0) + status.slice(1).toLowerCase()} Matches (
                {matches.length})
              </h3>
            </div>
            <div
              className={
                status === "LIVE"
                  ? "grid gap-4" // Live matches get full width
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" // Scheduled/Completed get grid layout
              }
            >
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  className={
                    status === "LIVE"
                      ? "match-card-live ring-2 ring-live/30"
                      : status === "COMPLETED"
                      ? "opacity-75"
                      : ""
                  }
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
