// src/server/types.ts
import { z } from "zod";

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
export type TeamId = z.infer<typeof TeamId>;

export const Team = z.object({
  id: TeamId,
  name: z.string(),
  shortName: z.string(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
});
export type Team = z.infer<typeof Team>;

export const Venue = z.object({
  name: z.string(),
  city: z.string().optional(),
});
export type Venue = z.infer<typeof Venue>;

export const MatchStatus = z.enum(["SCHEDULED", "LIVE", "COMPLETED"]);
export type MatchStatus = z.infer<typeof MatchStatus>;

export const Match = z.object({
  id: z.string(),
  matchNumber: z.string().optional(),
  status: MatchStatus,
  startTimeUTC: z.string(), // ISO
  venue: Venue,
  teams: z.tuple([TeamId, TeamId]),
  toss: z.string().optional(),
});
export type Match = z.infer<typeof Match>;

export const LiveInnings = z.object({
  battingTeam: TeamId,
  runs: z.number(),
  wickets: z.number(),
  overs: z.number(),
});
export type LiveInnings = z.infer<typeof LiveInnings>;

export const LiveScore = z.object({
  matchId: z.string(),
  innings: z.array(LiveInnings),
  currentOver: z.string().optional(),
  target: z.number().optional(),
  resultText: z.string().optional(),
});
export type LiveScore = z.infer<typeof LiveScore>;

export const LiveResponse = z.object({
  match: Match.nullable(),
  live: LiveScore.nullable(),
  next: Match.nullable(),
});
export type LiveResponse = z.infer<typeof LiveResponse>;

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
export type PointsRow = z.infer<typeof PointsRow>;

export const PointsTable = z.object({
  season: z.string(),
  updatedAt: z.string(),
  rows: z.array(PointsRow),
});
export type PointsTable = z.infer<typeof PointsTable>;

export const ScheduleResponse = z.object({
  season: z.string(),
  matches: z.array(Match),
});
export type ScheduleResponse = z.infer<typeof ScheduleResponse>;
