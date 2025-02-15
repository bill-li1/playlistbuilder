export const config = {
  // Server configuration
  port: 8080,
  host: "0.0.0.0",

  // Backend servers
  backends: ["http://localhost:3001", "http://localhost:3002"],

  // Rate limiting configuration
  rateLimit: {
    maxRequests: 5,
    windowMs: 10 * 1000, // 10 seconds
    pruneIntervalMs: 60 * 1000, // Cleanup every minute
  },

  // Health check configuration
  healthCheck: {
    intervalMs: 10 * 1000, // 10 seconds
    timeout: 5000, // 5 seconds
    path: "/health", // Health check endpoint
  },
} as const;
