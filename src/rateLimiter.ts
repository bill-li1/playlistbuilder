import { config } from "./config";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private pruneInterval: Timer;

  constructor() {
    this.store = new Map();
    this.pruneInterval = setInterval(
      () => this.pruneExpiredEntries(),
      config.rateLimit.pruneIntervalMs
    );
  }

  public isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry) {
      this.store.set(ip, {
        count: 1,
        resetTime: now + config.rateLimit.windowMs,
      });
      return false;
    }

    if (now >= entry.resetTime) {
      this.store.set(ip, {
        count: 1,
        resetTime: now + config.rateLimit.windowMs,
      });
      return false;
    }

    if (entry.count >= config.rateLimit.maxRequests) {
      return true;
    }

    entry.count++;
    return false;
  }

  private pruneExpiredEntries(): void {
    const now = Date.now();
    for (const [ip, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(ip);
      }
    }
  }

  public cleanup(): void {
    clearInterval(this.pruneInterval);
    this.store.clear();
  }
}
