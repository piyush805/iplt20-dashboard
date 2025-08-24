// src/utils/time.ts
export function formatMatchTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getMatchStatus(
  startTimeUTC: string,
  status: string
): {
  displayStatus: string;
  timeInfo: string;
} {
  const now = new Date();
  const startTime = new Date(startTimeUTC);

  if (status === "LIVE") {
    return {
      displayStatus: "LIVE",
      timeInfo: "Match in progress",
    };
  }

  if (status === "COMPLETED") {
    return {
      displayStatus: "COMPLETED",
      timeInfo: `Ended ${formatMatchTime(startTimeUTC)}`,
    };
  }

  // SCHEDULED
  const timeDiff = startTime.getTime() - now.getTime();
  const hoursUntil = Math.round(timeDiff / (1000 * 60 * 60));

  if (hoursUntil < 0) {
    return {
      displayStatus: "SCHEDULED",
      timeInfo: formatMatchTime(startTimeUTC),
    };
  }

  if (hoursUntil < 24) {
    return {
      displayStatus: "UPCOMING",
      timeInfo: `In ${hoursUntil}h`,
    };
  }

  return {
    displayStatus: "SCHEDULED",
    timeInfo: formatMatchTime(startTimeUTC),
  };
}

export function isMatchLive(status: string): boolean {
  return status === "LIVE";
}

export function getPollingInterval(status: string): number {
  // Return polling interval in milliseconds
  if (status === "LIVE") {
    return 15000; // 15 seconds for live matches
  }
  return 60000; // 1 minute for non-live matches
}
