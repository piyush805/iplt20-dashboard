import {
  LiveResponse,
  PointsTable,
  Match,
  MatchStatus,
  ScheduleResponse,
} from "@/server/types";

// Enhanced data types with better specificity
export interface EnhancedScheduleProps {
  initialData: ScheduleResponse | null;
}

export type FilterStatus = MatchStatus | "ALL";

// Points table specific types
export interface PointsTableHeaderData {
  data: PointsTable;
}

export interface PointsTableRowData {
  team: any; // PointsRow from server types
  index: number;
  totalTeams: number;
}

// Section component data types
export interface LiveMatchesSectionData {
  livePayload: LiveResponse | null;
  error: string | null;
}

export interface UpcomingMatchesSectionData {
  livePayload: LiveResponse | null;
}

// Schedule data types
export interface ScheduleFiltersData {
  statusFilter: MatchStatus | "ALL";
  teamFilter: string;
  searchQuery: string;
  onStatusFilterChange: (status: MatchStatus | "ALL") => void;
  onTeamFilterChange: (team: string) => void;
  onSearchQueryChange: (query: string) => void;
  getStatusCount: (status: MatchStatus) => number;
}

export interface ScheduleGroupsData {
  groupedMatches: Record<MatchStatus, Match[]>;
}
