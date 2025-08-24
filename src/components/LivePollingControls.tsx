"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { isMatchLive, getPollingInterval } from "@/utils/time";
import { env } from "@/config/env";

export default function LivePollingControls() {
  const {
    livePayload,
    isLoading,
    error,
    startPollingLive,
    stopPollingLive,
    _poller,
  } = useAppStore();

  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Update polling state when _poller changes
  useEffect(() => {
    setIsPolling(_poller !== null);
  }, [_poller]);

  // Update last update time when live payload changes
  useEffect(() => {
    if (livePayload) {
      setLastUpdate(new Date());
    }
  }, [livePayload]);

  // Auto-start polling if there's a live match (only in live mode)
  useEffect(() => {
    if (
      env.POLLING_ENABLED &&
      livePayload?.match &&
      isMatchLive(livePayload.match.status) &&
      !isPolling
    ) {
      const interval = getPollingInterval(livePayload.match.status);
      startPollingLive(interval);
    }
  }, [livePayload, isPolling, startPollingLive]);

  const handleTogglePolling = () => {
    if (isPolling) {
      stopPollingLive();
    } else {
      const interval = livePayload?.match
        ? getPollingInterval(livePayload.match.status)
        : 15000;
      startPollingLive(interval);
    }
  };

  const getStatusColor = () => {
    if (error) return "bg-red-100 text-red-800 border-red-200";
    if (isPolling) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isLoading) return "Loading...";
    if (isPolling) return "Live Polling Active";
    return "Polling Stopped";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Live Updates
        </h3>
        <div
          className={`px-3 py-1 rounded-full text-sm border ${getStatusColor()}`}
        >
          {getStatusText()}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {lastUpdate && (
            <span suppressHydrationWarning>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          {!lastUpdate && <span>No updates yet</span>}
        </div>

        <button
          onClick={handleTogglePolling}
          disabled={isLoading || !env.POLLING_ENABLED}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isPolling
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading
            ? "Loading..."
            : isPolling
            ? "Stop Polling"
            : "Start Polling"}
        </button>
      </div>

      {/* Polling Info */}
      {livePayload?.match && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Polling interval:{" "}
            {getPollingInterval(livePayload.match.status) / 1000}s
            {isMatchLive(livePayload.match.status) && (
              <span className="ml-2 text-red-600 font-medium">
                • LIVE MATCH
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
