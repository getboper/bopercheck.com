import { notifySearchFailure, notifyPerformanceDegradation, notifySystemHealth } from "./errorNotifications";

interface SearchMetrics {
  totalSearches: number;
  successfulSearches: number;
  failedSearches: number;
  successRate: number;
  avgResponseTime: number;
  errorTypes: Map<string, number>;
  lastResetTime: number;
}

class RealTimeMonitor {
  private static instance: RealTimeMonitor;
  private metrics: SearchMetrics;
  private readonly MONITORING_WINDOW = 5 * 60 * 1000; // 5 minutes
  private readonly SUCCESS_RATE_THRESHOLD = 0.85; // 85% success rate threshold
  private readonly RESPONSE_TIME_THRESHOLD = 10000; // 10 seconds

  constructor() {
    this.metrics = this.initializeMetrics();
    this.startPeriodicChecks();
  }

  static getInstance(): RealTimeMonitor {
    if (!RealTimeMonitor.instance) {
      RealTimeMonitor.instance = new RealTimeMonitor();
    }
    return RealTimeMonitor.instance;
  }

  private initializeMetrics(): SearchMetrics {
    return {
      totalSearches: 0,
      successfulSearches: 0,
      failedSearches: 0,
      successRate: 1.0,
      avgResponseTime: 0,
      errorTypes: new Map(),
      lastResetTime: Date.now()
    };
  }

  // Track successful search
  public trackSearchSuccess(responseTime: number): void {
    this.metrics.totalSearches++;
    this.metrics.successfulSearches++;
    this.updateSuccessRate();
    this.updateResponseTime(responseTime);
  }

  // Track failed search with immediate notification
  public async trackSearchFailure(errorType: string, errorMessage: string, userDetails: any): Promise<void> {
    this.metrics.totalSearches++;
    this.metrics.failedSearches++;
    this.updateSuccessRate();

    // Track error types
    const currentCount = this.metrics.errorTypes.get(errorType) || 0;
    this.metrics.errorTypes.set(errorType, currentCount + 1);

    // Send immediate notification for critical errors
    const criticalErrors = [
      'Method is not a valid HTTP token',
      'Analysis failed',
      'HTTP error! status: 500',
      'Complete search failure',
      'JSON parsing failed'
    ];

    const isCritical = criticalErrors.some(critical => 
      errorMessage.includes(critical) || errorType.includes(critical)
    );

    if (isCritical) {
      await notifySearchFailure(
        errorMessage,
        userDetails.item || 'unknown',
        userDetails.userAgent,
        userDetails.location,
        userDetails.guestId,
        userDetails.stack
      );
    }

    // Check if success rate has dropped below threshold
    if (this.metrics.successRate < this.SUCCESS_RATE_THRESHOLD && this.metrics.totalSearches >= 5) {
      await this.notifyPerformanceDrop();
    }
  }

  private updateSuccessRate(): void {
    this.metrics.successRate = this.metrics.successfulSearches / this.metrics.totalSearches;
  }

  private updateResponseTime(responseTime: number): void {
    // Simple moving average for response time
    const totalResponseTime = this.metrics.avgResponseTime * (this.metrics.successfulSearches - 1) + responseTime;
    this.metrics.avgResponseTime = totalResponseTime / this.metrics.successfulSearches;
  }

  private async notifyPerformanceDrop(): Promise<void> {
    const errorBreakdown = Array.from(this.metrics.errorTypes.entries())
      .map(([type, count]) => `${type}: ${count}`)
      .join(', ');

    await notifyPerformanceDegradation(
      'Search Success Rate',
      this.metrics.successRate,
      this.SUCCESS_RATE_THRESHOLD,
      {
        totalSearches: this.metrics.totalSearches,
        failedSearches: this.metrics.failedSearches,
        errorBreakdown,
        windowStart: new Date(this.metrics.lastResetTime).toISOString()
      }
    );
  }

  // Periodic health checks
  private startPeriodicChecks(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, this.MONITORING_WINDOW);
  }

  private async performHealthCheck(): Promise<void> {
    const now = Date.now();
    const timeSinceReset = now - this.metrics.lastResetTime;

    // Reset metrics every monitoring window
    if (timeSinceReset >= this.MONITORING_WINDOW) {
      this.resetMetrics();
    }

    // Check system health indicators
    await this.checkSystemHealth();
  }

  private async checkSystemHealth(): Promise<void> {
    try {
      // Check database connectivity
      const dbStatus = await this.checkDatabaseHealth();
      
      // Check AI service availability
      const aiStatus = await this.checkAIServiceHealth();
      
      // Check email service
      const emailStatus = await this.checkEmailServiceHealth();

      // Notify if any service is down
      if (!dbStatus || !aiStatus || !emailStatus) {
        await notifySystemHealth(
          'BoperCheck Services',
          'degraded',
          {
            database: dbStatus ? 'healthy' : 'down',
            aiService: aiStatus ? 'healthy' : 'down',
            emailService: emailStatus ? 'healthy' : 'down'
          }
        );
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      // Simple database ping
      const { db } = await import("./db");
      await db.execute('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  private async checkAIServiceHealth(): Promise<boolean> {
    try {
      // Check if Anthropic API key is available
      return !!process.env.ANTHROPIC_API_KEY;
    } catch {
      return false;
    }
  }

  private async checkEmailServiceHealth(): Promise<boolean> {
    try {
      // Check if SendGrid API key is available
      return !!process.env.SENDGRID_API_KEY;
    } catch {
      return false;
    }
  }

  private resetMetrics(): void {
    this.metrics = this.initializeMetrics();
  }

  // Get current metrics for admin dashboard
  public getCurrentMetrics(): SearchMetrics {
    return { ...this.metrics };
  }

  // Manual error reporting for specific scenarios
  public async reportError(
    errorType: string,
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any
  ): Promise<void> {
    await notifySearchFailure(
      `${errorType}: ${message}`,
      details.item || 'system',
      details.userAgent,
      details.location,
      details.guestId,
      details.stack
    );
  }
}

export const realTimeMonitor = RealTimeMonitor.getInstance();
export default RealTimeMonitor;