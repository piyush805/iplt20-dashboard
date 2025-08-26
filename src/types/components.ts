// src/types/components.ts
// Component prop types for UI components

import { ReactNode } from "react";
import {
  MatchStatus,
  Match,
  PointsTable,
  LiveResponse,
  ScheduleResponse,
  PointsRow,
} from "./entities";

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
  groupedMatches: Record<MatchStatus, Match[]>;
}

// Points table component types
export interface PointsTableHeaderProps {
  data: PointsTable;
}

export interface PointsTableRowProps {
  team: PointsRow; // PointsRow from entities
  index: number;
  totalTeams: number;
}

// Section component types
export interface LiveMatchesSectionProps {
  livePayload: LiveResponse | null;
  error: string | null;
}

export interface UpcomingMatchesSectionProps {
  livePayload: LiveResponse | null;
}

// Enhanced data types with better specificity
export interface EnhancedScheduleProps {
  initialData: ScheduleResponse | null; // ScheduleResponse from entities
}

export type FilterStatus = MatchStatus | "ALL";

// Points table specific types
export interface PointsTableHeaderData {
  data: PointsTable;
}

export interface PointsTableRowData {
  team: PointsRow; // PointsRow from entities
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
