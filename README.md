# Rate-Limited Load Balancer

A high-performance rate-limited load balancer implemented in Bun.js that distributes requests across multiple backend servers using round-robin load balancing.

## Features

- Round-robin load balancing
- IP-based rate limiting
- Health checks for backend servers
- In-memory rate limiting (easily swappable with Redis)
- Automatic pruning of expired rate limit entries

## Configuration

The load balancer is configured with the following default settings:

- Load balancer port: 8080
- Backend servers:
  - http://localhost:3001
  - http://localhost:3002
- Rate limit: 5 requests per 10 seconds per IP
- Health check interval: 10 seconds

## Getting Started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start the load balancer:

   ```bash
   bun run start
   ```

   For development with hot reload:

   ```bash
   bun run dev
   ```

## API Responses

- `200 OK`: Successful request forwarded to backend
- `429 Too Many Requests`: Rate limit exceeded
- `503 Service Unavailable`: All backend servers are down

## Architecture

The project is structured into several modules:

- `server.ts`: Main server implementation
- `loadBalancer.ts`: Round-robin load balancing logic
- `rateLimiter.ts`: Rate limiting implementation
- `healthChecker.ts`: Backend server health monitoring
- `config.ts`: Configuration settings
