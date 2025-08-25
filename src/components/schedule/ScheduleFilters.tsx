import StatusBadge from "@/components/ui/StatusBadge";
import { APP_TEXT, TEAM_NAMES } from "@/constants/text";
import { ScheduleFiltersProps } from "@/types";

export default function ScheduleFilters({
  statusFilter,
  teamFilter,
  searchQuery,
  onStatusFilterChange,
  onTeamFilterChange,
  onSearchQueryChange,
  getStatusCount,
}: ScheduleFiltersProps) {
  const allTeams = Object.entries(TEAM_NAMES).map(([id, name]) => ({
    id,
    name,
  }));

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Match Status
          </label>
          <div className="flex flex-wrap gap-2">
            {(["ALL", "LIVE", "SCHEDULED", "COMPLETED"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => onStatusFilterChange(status)}
                  className={`transition-all duration-200 ${
                    statusFilter === status
                      ? "ring-2 ring-primary ring-offset-2 rounded-full"
                      : "hover:scale-105"
                  }`}
                >
                  <StatusBadge
                    status={status}
                    showCount={status !== "ALL"}
                    count={status === "ALL" ? 0 : getStatusCount(status)}
                  />
                </button>
              )
            )}
          </div>
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Team
          </label>
          <select
            value={teamFilter}
            onChange={(e) => onTeamFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">All Teams</option>
            {allTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={APP_TEXT.schedule.search.placeholder}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
