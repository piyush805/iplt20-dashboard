// src/hooks/useSmartPolling.ts
import { useCallback, useEffect, useRef } from "react";
import { usePolling } from "@/store/useAppStore";

// IPL Season business logic
const isIPLSeasonActive = (): boolean => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12

  // IPL typically runs March-May
  if (currentMonth >= 3 && currentMonth <= 5) {
    return true;
  }

  // Could also check for specific dates or upcoming matches
  return false;
};

export const useSmartPolling = () => {
  const { startPolling, stopPolling, isPolling } = usePolling();
  const userActivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset user activity timer
  const resetUserActivity = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (userActivityTimeoutRef.current) {
      clearTimeout(userActivityTimeoutRef.current);
    }

    // Stop polling after 5 minutes of inactivity
    userActivityTimeoutRef.current = setTimeout(() => {
      if (isPolling) {
        console.log("User inactive for 5 minutes, stopping polling");
        stopPolling();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }, [isPolling, stopPolling]);

  // Check if we should start polling based on business logic
  const shouldStartPolling = useCallback(async (): Promise<boolean> => {
    // 1. Check if IPL season is active
    if (!isIPLSeasonActive()) {
      console.log("IPL season not active, not starting polling");
      return false;
    }

    // 2. Check if user has been active recently
    const timeSinceLastActivity = Date.now() - lastActivityRef.current;
    if (timeSinceLastActivity > 10 * 60 * 1000) {
      // 10 minutes
      console.log("User inactive for too long, not starting polling");
      return false;
    }

    return true;
  }, []);

  // Smart start polling with business logic checks
  const startSmartPolling = useCallback(
    async (intervalMs = 15000) => {
      const shouldPoll = await shouldStartPolling();

      if (shouldPoll) {
        console.log("Business logic checks passed, starting polling");
        startPolling(intervalMs);
      } else {
        console.log("Business logic checks failed, not starting polling");
      }
    },
    [shouldStartPolling, startPolling]
  );

  // Set up user activity listeners
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleUserActivity = () => {
      resetUserActivity();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Initial activity
    resetUserActivity();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });

      if (userActivityTimeoutRef.current) {
        clearTimeout(userActivityTimeoutRef.current);
      }
    };
  }, [resetUserActivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (userActivityTimeoutRef.current) {
        clearTimeout(userActivityTimeoutRef.current);
      }
    };
  }, []);

  return {
    startSmartPolling,
    stopPolling,
    isPolling,
    shouldStartPolling,
  };
};
