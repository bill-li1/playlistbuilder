import { config } from "./config";
import { RateLimiter } from "./rateLimiter";
import { HealthChecker } from "./healthChecker";
import { LoadBalancer } from "./loadBalancer";

const rateLimiter = new RateLimiter();
const healthChecker = new HealthChecker();
const loadBalancer = new LoadBalancer(healthChecker);

// Cleanup function for graceful shutdown
function cleanup() {
  rateLimiter.cleanup();
  loadBalancer.cleanup();
  process.exit(0);
}

// Handle graceful shutdown
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

const server = Bun.serve({
  port: config.port,
  hostname: config.host,

  async fetch(req) {
    const url = new URL(req.url);
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";

    // Skip rate limiting for health check endpoint
    if (url.pathname === config.healthCheck.path) {
      return new Response("OK", { status: 200 });
    }

    // Check rate limit
    if (rateLimiter.isRateLimited(clientIP)) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    // Get next available server
    const targetServer = loadBalancer.getNextServer();
    if (!targetServer) {
      return new Response("No healthy backends available", { status: 503 });
    }

    try {
      // Forward the request to the backend server
      const targetUrl = new URL(url.pathname + url.search, targetServer);
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });

      // Forward the response back to the client
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      console.error(`Error forwarding request to ${targetServer}:`, error);
      return new Response("Backend server error", { status: 502 });
    }
  },
});

console.log(
  `Load balancer running at http://${server.hostname}:${server.port}`
);
