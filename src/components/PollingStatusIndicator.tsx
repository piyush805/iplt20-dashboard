// src/components/PollingStatusIndicator.tsx
import { useSmartPolling } from "@/hooks/useSmartPolling";
import { useState } from "react";

export default function PollingStatusIndicator() {
  const { startSmartPolling, stopPolling, isPolling, shouldStartPolling } =
    useSmartPolling();
  const [restrictionMessage, setRestrictionMessage] = useState<string | null>(
    null
  );

  const handleTogglePolling = async () => {
    if (isPolling) {
      stopPolling();
      setRestrictionMessage(null);
    } else {
      const canStart = await shouldStartPolling();
      if (canStart) {
        startSmartPolling(15000);
        setRestrictionMessage(null);
      } else {
        // Get the specific restriction reason
        const reason = getRestrictionReason();
        setRestrictionMessage(reason);

        // Clear the message after 5 seconds
        setTimeout(() => setRestrictionMessage(null), 5000);
      }
    }
  };

  const getRestrictionReason = (): string => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Check IPL season
    if (currentMonth < 3 || currentMonth > 5) {
      return "IPL season not active (March-May only)";
    }

    // Check user activity (simplified check)
    return "User inactive for too long";
  };

  const getStatusColor = () => {
    if (isPolling) return "bg-green-500";
    return "bg-gray-400";
  };

  const getStatusText = () => {
    if (isPolling) return "Live updates active";
    return "Live updates paused";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-elegant">
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor()} ${
                isPolling ? "animate-pulse" : ""
              }`}
            ></div>
            <span className="text-sm font-medium text-foreground">
              {getStatusText()}
            </span>
          </div>

          {/* Toggle Button */}
          <button
            onClick={handleTogglePolling}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              isPolling
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isPolling ? "Stop" : "Start"}
          </button>
        </div>

        {/* Restriction Message */}
        {restrictionMessage && (
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-xs text-amber-700 dark:text-amber-300">
                Polling paused: {restrictionMessage}
              </span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        {isPolling && (
          <div className="mt-2 text-xs text-muted-foreground">
            Updates every 15 seconds
          </div>
        )}
      </div>
    </div>
  );
}
