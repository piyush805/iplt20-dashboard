// Environment configuration for IPL Dashboard
export const env = {
  // Data source control (affects both server and client)
  USE_DUMMY: process.env.USE_DUMMY !== "0", // Default to true (dummy data)

  // Client-side polling control
  POLLING_ENABLED: process.env.USE_DUMMY === "0", // Only enable if not dummy

  // Build-time flags (for conditional rendering)
  IS_LIVE_MODE: process.env.USE_DUMMY === "0",
  IS_DEMO_MODE: process.env.USE_DUMMY !== "0",

  // API endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",

  // Polling intervals (only used in live mode)
  POLLING_INTERVAL: process.env.POLLING_INTERVAL
    ? parseInt(process.env.POLLING_INTERVAL)
    : 5000,
} as const;

// Type-safe environment access
export type EnvConfig = typeof env;
