// src/types/entities.ts
// Core entity types inferred from Zod schemas

// Team types
export type TeamId =
  | "CSK"
  | "MI"
  | "RCB"
  | "KKR"
  | "SRH"
  | "PBKS"
  | "RR"
  | "GT"
  | "DC"
  | "LSG";

export interface Team {
  id: TeamId;
  name: string;
  shortName: string;
  logoUrl?: string;
  primaryColor?: string;
}

// Venue types
export interface Venue {
  name: string;
  city?: string;
}

// Match types
export type MatchStatus = "SCHEDULED" | "LIVE" | "COMPLETED";

export interface Match {
  id: string;
  matchNumber?: string;
  status: MatchStatus;
  startTimeUTC: string; // ISO
  venue: Venue;
  teams: [TeamId, TeamId];
  toss?: string;
}

// Live score types
export interface LiveInnings {
  battingTeam: TeamId;
  runs: number;
  wickets: number;
  overs: number;
}

export interface LiveScore {
  matchId: string;
  innings: LiveInnings[];
  currentOver?: string;
  target?: number;
  resultText?: string;
}

// Response types
export interface LiveResponse {
  match: Match | null;
  live: LiveScore | null;
  next: Match | null;
}

// Points table types
export interface PointsRow {
  team: TeamId;
  played: number;
  won: number;
  lost: number;
  tied: number;
  nr: number;
  nrr: number;
  for: {
    runs: number;
    overs: number;
  };
  against: {
    runs: number;
    overs: number;
  };
  points: number;
  form?: ("W" | "L" | "N")[];
}

export interface PointsTable {
  season: string;
  updatedAt: string;
  rows: PointsRow[];
}

// Schedule types
export interface ScheduleResponse {
  season: string;
  matches: Match[];
}
