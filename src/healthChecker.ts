import { config } from "./config";

export class HealthChecker {
  private healthyServers: Set<string>;
  private checkInterval: Timer;

  constructor() {
    this.healthyServers = new Set(config.backends);
    this.checkInterval = setInterval(
      () => this.checkHealth(),
      config.healthCheck.intervalMs
    );
    // Initial health check
    this.checkHealth();
  }

  public getHealthyServers(): string[] {
    return Array.from(this.healthyServers);
  }

  public isHealthy(server: string): boolean {
    return this.healthyServers.has(server);
  }

  private async checkHealth(): Promise<void> {
    for (const server of config.backends) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(
          () => controller.abort(),
          config.healthCheck.timeout
        );

        const response = await fetch(`${server}${config.healthCheck.path}`, {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          this.healthyServers.add(server);
        } else {
          this.healthyServers.delete(server);
        }
      } catch (error) {
        this.healthyServers.delete(server);
      }
    }
  }

  public cleanup(): void {
    clearInterval(this.checkInterval);
  }
}
