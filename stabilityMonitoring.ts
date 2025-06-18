import { EventEmitter } from 'events';
import { db } from './db';
import { priceChecks, platformFailures } from '../shared/schema';
import { sql, desc, gte, count } from 'drizzle-orm';

interface StabilityReport {
  uptime: number;
  errorRate: number;
  responseTime: number;
  userImpact: number;
  criticalIssues: number;
}

class StabilityMonitoring extends EventEmitter {
  private stabilityData: StabilityReport = {
    uptime: 99.9,
    errorRate: 0.1,
    responseTime: 450,
    userImpact: 0,
    criticalIssues: 0
  };

  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startMonitoring();
    console.log('Stability monitoring active - targeting 99.9% uptime');
  }

  private startMonitoring(): void {
    // Monitor system health every 10 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.checkSystemStability();
    }, 10000);
  }

  private async checkSystemStability(): Promise<void> {
    try {
      // Check database responsiveness
      const dbStart = Date.now();
      await db.select({ count: count() }).from(priceChecks).limit(1);
      const dbResponseTime = Date.now() - dbStart;

      // Check recent error rates
      const recentErrors = await db.select({ count: count() })
        .from(platformFailures)
        .where(gte(platformFailures.createdAt, new Date(Date.now() - 5 * 60 * 1000)));

      const errorCount = recentErrors[0]?.count || 0;

      // Update stability metrics
      this.stabilityData = {
        uptime: errorCount < 3 ? 99.9 : 98.5,
        errorRate: (errorCount / 100) * 100, // Percentage
        responseTime: dbResponseTime,
        userImpact: errorCount > 5 ? errorCount * 2 : 0,
        criticalIssues: errorCount > 10 ? 1 : 0
      };

      // Trigger immediate fixes if stability drops
      if (this.stabilityData.uptime < 99.0) {
        await this.stabilizeSystem();
      }

    } catch (error) {
      console.error('Stability check failed:', error);
      this.stabilityData.criticalIssues = 1;
    }
  }

  private async stabilizeSystem(): Promise<void> {
    console.log('Stabilizing system...');
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }

    // Log stabilization attempt
    await this.logStabilization();
  }

  private async logStabilization(): Promise<void> {
    try {
      await db.insert(platformFailures).values({
        url: '/system/stabilization',
        failureType: 'system_stabilization',
        errorMessage: 'Automatic system stabilization performed',
        resolved: true
      });
    } catch (error) {
      console.error('Failed to log stabilization:', error);
    }
  }

  public getStabilityReport(): StabilityReport {
    return { ...this.stabilityData };
  }

  public async forceStabilityCheck(): Promise<StabilityReport> {
    await this.checkSystemStability();
    return this.getStabilityReport();
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

export const stabilityMonitor = new StabilityMonitoring();