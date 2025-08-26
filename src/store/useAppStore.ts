// src/store/useAppStore.ts
import { create } from "zustand";
import { LiveResponse, AppState, PollingHook } from "@/types";

export const useAppStore = create<AppState>((set, get) => ({
  livePayload: null,
  points: null,
  schedule: null,
  isLoading: false,
  error: null,
  _poller: null,

  setLivePayload: (payload) => set({ livePayload: payload, error: null }),
  setPoints: (points) => set({ points, error: null }),
  setSchedule: (schedule) => set({ schedule, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  startPollingLive: (intervalMs = 15000) => {
    const currentPoller = get()._poller;
    if (currentPoller) {
      console.log("Polling already active, stopping previous poller");
      clearInterval(currentPoller);
    }

    const pollFunction = async () => {
      try {
        const response = await fetch("/api/live");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: LiveResponse = await response.json();
        get().setLivePayload(data);

        // Adjust polling interval based on match status
        const currentMatch = data.match;
        if (currentMatch?.status === "LIVE") {
          // Keep current fast polling for live matches
          console.log("Live match detected, maintaining fast polling");
        } else if (currentMatch?.status === "SCHEDULED") {
          // Could implement slower polling for scheduled matches
          console.log("Scheduled match, continuing polling");
        }
      } catch (error) {
        console.error("Live polling error:", error);
        get().setError(
          error instanceof Error ? error.message : "Polling failed"
        );
      }
    };

    // Initial fetch
    pollFunction();

    // Set up interval
    const id = setInterval(pollFunction, intervalMs);
    set({ _poller: id as unknown as number });

    console.log(`Started live polling with ${intervalMs}ms interval`);
  },

  stopPollingLive: () => {
    const currentPoller = get()._poller;
    if (currentPoller) {
      clearInterval(currentPoller);
      set({ _poller: null });
      console.log("Stopped live polling");
    }
  },
}));

// Helper hook for easy polling management
export const usePolling = (): PollingHook => {
  const { startPollingLive, stopPollingLive, _poller } = useAppStore();

  return {
    startPolling: startPollingLive,
    stopPolling: stopPollingLive,
    isPolling: _poller !== null,
  };
};
