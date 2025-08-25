import { ReactNode } from "react";
import { MatchStatus } from "@/server/types";

// ActionButton component types
export interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

// StatusBadge component types
export interface StatusBadgeProps {
  status: MatchStatus | "ALL";
  className?: string;
  showCount?: boolean;
  count?: number;
}

// SectionHeader component types
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

// Schedule component types
export interface ScheduleFiltersProps {
  statusFilter: MatchStatus | "ALL";
  teamFilter: string;
  searchQuery: string;
  onStatusFilterChange: (status: MatchStatus | "ALL") => void;
  onTeamFilterChange: (team: string) => void;
  onSearchQueryChange: (query: string) => void;
  getStatusCount: (status: MatchStatus) => number;
}

export interface ScheduleGroupsProps {
  groupedMatches: Record<MatchStatus, any[]>;
}

// Points table component types
export interface PointsTableHeaderProps {
  data: any;
}

export interface PointsTableRowProps {
  team: any;
  index: number;
  totalTeams: number;
}

// Section component types
export interface LiveMatchesSectionProps {
  livePayload: any;
  error: string | null;
}

export interface UpcomingMatchesSectionProps {
  livePayload: any;
}
