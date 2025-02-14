import { HealthChecker } from "./healthChecker";

export class LoadBalancer {
  private currentIndex: number;
  private healthChecker: HealthChecker;

  constructor(healthChecker: HealthChecker) {
    this.currentIndex = 0;
    this.healthChecker = healthChecker;
  }

  public getNextServer(): string | null {
    const healthyServers = this.healthChecker.getHealthyServers();

    if (healthyServers.length === 0) {
      return null;
    }

    // Round-robin selection
    this.currentIndex = (this.currentIndex + 1) % healthyServers.length;
    return healthyServers[this.currentIndex];
  }

  public cleanup(): void {
    this.healthChecker.cleanup();
  }
}
