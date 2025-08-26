// src/types/store.ts
// Store-related types for Zustand store

import { LiveResponse, PointsTable, ScheduleResponse } from "./entities";

export interface AppState {
  livePayload: LiveResponse | null;
  points: PointsTable | null;
  schedule: ScheduleResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLivePayload: (payload: LiveResponse) => void;
  setPoints: (points: PointsTable) => void;
  setSchedule: (schedule: ScheduleResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Polling controls
  startPollingLive: (intervalMs?: number) => void;
  stopPollingLive: () => void;

  // Internal polling state
  _poller: number | null;
}

export interface PollingHook {
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
  isPolling: boolean;
}
