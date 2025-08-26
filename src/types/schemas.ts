// src/types/schemas.ts
import { z } from "zod";

// Team schemas
export const TeamId = z.enum([
  "CSK",
  "MI",
  "RCB",
  "KKR",
  "SRH",
  "PBKS",
  "RR",
  "GT",
  "DC",
  "LSG",
]);

export const Team = z.object({
  id: TeamId,
  name: z.string(),
  shortName: z.string(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
});

// Venue schemas
export const Venue = z.object({
  name: z.string(),
  city: z.string().optional(),
});

// Match schemas
export const MatchStatus = z.enum(["SCHEDULED", "LIVE", "COMPLETED"]);

export const Match = z.object({
  id: z.string(),
  matchNumber: z.string().optional(),
  status: MatchStatus,
  startTimeUTC: z.string(), // ISO
  venue: Venue,
  teams: z.tuple([TeamId, TeamId]),
  toss: z.string().optional(),
});

// Live score schemas
export const LiveInnings = z.object({
  battingTeam: TeamId,
  runs: z.number(),
  wickets: z.number(),
  overs: z.number(),
});

export const LiveScore = z.object({
  matchId: z.string(),
  innings: z.array(LiveInnings),
  currentOver: z.string().optional(),
  target: z.number().optional(),
  resultText: z.string().optional(),
});

// Response schemas
export const LiveResponse = z.object({
  match: Match.nullable(),
  live: LiveScore.nullable(),
  next: Match.nullable(),
});

// Points table schemas
export const PointsRow = z.object({
  team: TeamId,
  played: z.number(),
  won: z.number(),
  lost: z.number(),
  tied: z.number().default(0),
  nr: z.number().default(0),
  nrr: z.number(),
  for: z.object({
    runs: z.number(),
    overs: z.number(),
  }),
  against: z.object({
    runs: z.number(),
    overs: z.number(),
  }),
  points: z.number(),
  form: z.array(z.enum(["W", "L", "N"])).optional(),
});

export const PointsTable = z.object({
  season: z.string(),
  updatedAt: z.string(),
  rows: z.array(PointsRow),
});

// Schedule schemas
export const ScheduleResponse = z.object({
  season: z.string(),
  matches: z.array(Match),
});
